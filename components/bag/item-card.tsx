"use client";

import { ScrapedProduct } from "@/types/scraped-product";

type ItemCardProps = {
  product: ScrapedProduct;
};

export function ItemCard({ product }: ItemCardProps) {
  if (!product.title) {
    return (
      <div className="border p-4 rounded-lg bg-red-50 text-red-700">
        <p className="font-bold">Falha ao carregar item</p>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm truncate hover:underline"
        >
          {product.url}
        </a>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-lg max-w-full shadow-sm">
      <div className="flex bg-red-500">
        
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-60 h-48 object-cover rounded-md mb-2"
          />
        )}
        <div className="bg-green-500 w-full">
          <h2 className="font-bold text-lg truncate" title={product.title}>
            {product.title}
          </h2>
          {product.price && (
            <p className="text-gray-700">
              Preço: {product.currency} {product.price}
            </p>
          )}
        </div>
      </div>
      <a
        href={product.url}
        target=""
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline text-sm mt-2 block"
      >
        Ver produto
      </a>
      {product.price && (
        <p className="text-gray-700">
          Preço: {product.currency} {product.price}
        </p>
      )}
    </div>
  );
}
