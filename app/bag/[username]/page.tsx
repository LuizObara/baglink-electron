import getItemsByUsername from "@/lib/supabase/actions/items"; // Ajuste o caminho se necessário
import { ProductScraper } from "@/lib/scraper/product-scraper";
import { ItemCard } from "@/components/bag/item-card"; // Criaremos este componente a seguir
import { AddItemForm } from "@/components/bag/add-item-form"; // Componente para adicionar novos itens

type BagProps = {
  params: Promise<{ username: string }>
}

export default async function BagPage({
  params,
}: BagProps) {
  const { username } = await params;

  const items = await getItemsByUsername(username);

  const scrapedItemsPromises = items
    .filter((item) => item.url)
    .map((item) => ProductScraper.scrape(item.url!));

  const scrapedProducts = await Promise.all(scrapedItemsPromises);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bolsa de {username}</h1>

      <div className="mt-8 grid grid-cols-1 gap-4">
        {scrapedProducts.map((product, index) => (
          <ItemCard key={index} product={product} />
        ))}
      </div>
      <AddItemForm username={username} />
    </div>
  );
}
