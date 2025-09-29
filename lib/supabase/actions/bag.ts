'use server'; 

import { z } from 'zod';
import { Bag } from "@/types/bag";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Busca todas as bolsas pertencentes ao usuário atualmente logado.
 * @returns Uma Promise que resolve para um array de bolsas.
 */
export async function getBagsByUser(): Promise<Bag[]> {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    console.log("Nenhum usuário logado, retornando array vazio.");
    return [];
  }

  const { data: bags, error } = await supabase
    .from('bags')
    .select('*')
    .eq('user_id', session.user.id) 
    .order('created_at', { ascending: false }); 

  if (error) {
    console.error("Erro ao buscar as bolsas do usuário:", error.message);
    return [];
  }

  return bags;
}

/**
 * Busca todas as bolsas de um usuário específico pelo seu username.
 * Esta função é PÚBLICA e usada na página /bags/[username].
 * @param username O nome de usuário do perfil a ser buscado.
 * @returns Uma Promise que resolve para um array de bolsas.
 */
export async function getBagsByUsername(username: string): Promise<Bag[]> {
  const supabase = await createClient();
  
  const { data: bags, error } = await supabase
    .from('bags')
    .select('*, profiles!inner(username)')
    .eq('profiles.username', username)     
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar bolsas pelo username:", error.message);
    return [];
  }
  
  return bags;
}

/**
 * Busca uma bolsa específica e todos os seus itens/produtos.
 * Esta função é PÚBLICA e usada na página /bag/[username]/[slug].
 * @param username O nome de usuário do dono da bolsa.
 * @param slug O slug da bolsa a ser buscada.
 * @returns Uma Promise que resolve para um único objeto de bolsa com seus itens.
 */
export async function getBagBySlug(username: string, slug: string): Promise<any | null> {
  const supabase = await createClient();
  
  const { data: bag, error } = await supabase
    .from('bags')
    .select(`
      *, 
      profiles!inner(username), 
      bag_items(
        *, 
        products(*)
      )
    `)
    .eq('profiles.username', username)
    .eq('slug', slug)
    .single(); 

  if (error) {
    console.error("Erro ao buscar bolsa pelo slug:", error.message);
    return null;
  }

  return bag;
}

/**
 * Cria uma nova bolsa para o usuário logado.
 * @param prevState Estado anterior do formulário (usado com useFormState).
 * @param formData Os dados enviados pelo formulário.
 * @returns Um objeto com uma mensagem de erro, se houver.
 */
export async function createBag(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { message: "Não autorizado. Por favor, faça login." };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', session.user.id)
    .single();

  if (!profile || !profile.username) {
    return { message: "Não foi possível encontrar seu perfil de usuário para criar o link." };
  }

  const name = formData.get('name') as string;
  if (!name || name.trim().length < 3) {
    return { message: "O nome da bolsa precisa ter pelo menos 3 caracteres." };
  }

  const slug = name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const { error } = await supabase
    .from('bags')
    .insert({
      user_id: session.user.id,
      name: name.trim(),
      slug: slug,
    });

  if (error) {
    console.error("Erro ao criar bolsa:", error);
    if (error.message.includes('Limite de 3 bolsas atingido')) {
      return { message: "Você atingiu o limite de 3 bolsas. Considere fazer um upgrade!" };
    }
    if (error.code === '23505') { 
      return { message: "Você já possui uma bolsa com um nome parecido. Tente outro." };
    }
    return { message: "Ocorreu um erro inesperado. Tente novamente." };
  }

  revalidatePath('/bag');
  revalidatePath(`/bags/${profile.username}`);

  redirect(`/bag/${profile.username}/${slug}`);
}

/**
 * Deleta uma bolsa específica pertencente ao usuário logado.
 * @param bagId O ID da bolsa a ser deletada.
 * @returns Um objeto com uma mensagem de sucesso ou erro.
 */
export async function deleteBag(bagId: string) {
  const schema = z.string().uuid();
  const validation = schema.safeParse(bagId);
  if (!validation.success) {
    return { error: "ID da bolsa inválido." };
  }

  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { error: "Não autorizado." };
  }

  const { error } = await supabase
    .from('bags')
    .delete()
    .match({ id: bagId, user_id: session.user.id });

  if (error) {
    console.error("Erro ao deletar bolsa:", error);
    return { error: "Ocorreu um erro no servidor ao tentar deletar a bolsa." };
  }

  revalidatePath('/bag');
  return { success: "Bolsa deletada com sucesso!" };
}