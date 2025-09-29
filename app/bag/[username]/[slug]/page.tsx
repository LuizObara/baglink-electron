import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { getBagBySlug } from '@/lib/supabase/actions/bag';
import { AddItemForm } from '@/components/bag/add-item-form';
import { DeleteItemButton } from '@/components/bag/delete-item-button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

type BagDetailPageProps = {
  params: Promise<{
    username: string;
    slug: string;
  }>
}

export default async function BagDetailPage({ params }: BagDetailPageProps) {
  const { username, slug } = await params;
  const bag = await getBagBySlug(username, slug);

  if (!bag) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4 sm:p-6 border-b">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">{bag.name}</h1>
        <p className="text-muted-foreground mt-1">
          Bag de <Link href={`/bags/${username}`} className="font-semibold text-primary hover:underline">{username}</Link>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 custom-scrollbar-thin">
        <h2 className="text-lg font-semibold mb-4">Itens na Bolsa</h2>
        {bag.bag_items.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg px-6">
              Esta bolsa ainda não tem itens. Adicione o primeiro!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bag.bag_items.map((item: any) => (
              <Card key={item.id} className="flex items-center p-4 shadow-sm">
                <div className="flex-grow min-w-0"> 
                  <CardTitle className="text-lg truncate">
                    {item.products.scraped_data?.title || "Produto sem título"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground truncate">
                    {item.products.url}
                  </CardDescription>
                  <p className="text-xl font-bold text-primary mt-1">
                    {item.products.scraped_data?.price ? `R$ ${item.products.scraped_data.price}` : "Preço indisponível"}
                  </p>
                </div>
                <div className="flex items-center ml-4 flex-shrink-0">
                  <a 
                    href={item.products.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-md hover:bg-muted"
                    title="Ver produto na loja"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                  <DeleteItemButton bagItemId={item.id} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 p-4 sm:p-6 border-t bg-background">
        <h2 className="text-lg font-semibold mb-2">Adicionar Novo Produto</h2>
        <AddItemForm bagId={bag.id} />
      </div>
    </div>
  );
}
