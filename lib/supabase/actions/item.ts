"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const FormSchema = z.object({
  url: z.string().url({ message: "Por favor, insira uma URL válida." }),
  bagId: z.string().uuid(),
});

/**
 * Adiciona um novo item (produto) a uma bolsa.
 * Este é o fluxo mais complexo: valida, chama a API de raspagem,
 * cria/atualiza o produto no catálogo central e o associa à bolsa.
 */
export async function addItemToBag(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return { error: "Não autorizado." };
  }

  const validatedFields = FormSchema.safeParse({
    url: formData.get("url"),
    bagId: formData.get("bagId"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.url?.[0] };
  }
  const { url, bagId } = validatedFields.data;

  const { data: bagOwner } = await supabase
    .from("bags")
    .select("id, profiles(username), slug")
    .match({ id: bagId, user_id: session.user.id })
    .single();

  if (!bagOwner) {
    return {
      error:
        "Bolsa não encontrada ou você não tem permissão para adicionar itens a ela.",
    };
  }

  let scrapedData;
  try {
    // const response = await fetch('http://ubuntu-server:3000/scrape', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ url })
    // });
    // if (!response.ok) throw new Error("Falha na raspagem");
    // scrapedData = await response.json();

    // Simulação enquanto a API não está pronta:
    scrapedData = {
      title: `Produto Raspado de ${new URL(url).hostname}`,
      price: (Math.random() * 200).toFixed(2),
    };
  } catch (e) {
    return {
      error: "Não foi possível obter os dados do produto. A URL está correta?",
    };
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .upsert(
      {
        url: url,
        scraped_data: scrapedData,
        last_scraped_at: new Date().toISOString(),
      },
      { onConflict: "url" }
    )
    .select("id")
    .single();

  if (productError || !product) {
    return { error: "Erro ao salvar o produto no catálogo." };
  }

  const { error: itemError } = await supabase.from("bag_items").insert({
    bag_id: bagId,
    product_id: product.id,
    user_id: session.user.id,
  });

  if (itemError) {
    if (itemError.code === "23505") {
      return { error: "Este produto já está na sua bolsa." };
    }
    if (itemError.message.includes("Limite de 10 itens por bolsa atingido")) {
      return { error: "Você atingiu o limite de 10 itens para esta bolsa." };
    }
    return { error: "Erro ao adicionar o item à bolsa." };
  }

  const username = bagOwner.profiles?.[0]?.username;

  if (username) {
    revalidatePath(`/bag/${username}/${bagOwner.slug}`);
  }

  return { success: "Produto adicionado com sucesso!" };
}

/**
 * Deleta um item de uma bolsa.
 */
export async function deleteItemFromBag(bagItemId: string) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("bag_items")
    .delete()
    .match({ id: bagItemId, user_id: session.user.id });

  if (error) {
    return { error: "Erro ao deletar o item." };
  }

  return { success: "Item removido com sucesso." };
}
