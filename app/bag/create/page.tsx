import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CreateBagForm } from '@/components/bag/create-bag-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function CreateBagPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }
  
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Criar Nova Bolsa</CardTitle>
          <CardDescription>
            Dê um nome para sua nova bolsa. Lembre-se, o nome será usado para criar um link compartilhável.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateBagForm />
        </CardContent>
      </Card>
    </div>
  );
}