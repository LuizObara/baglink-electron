export type ScrapedProduct = {
  title: string | null;
  price: number | null;
  discountPrice: number | null;
  currency: string | null;
  description: string | null;
  images: string[];
  url: string;
  scrapedAt: string;
};