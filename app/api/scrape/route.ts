import { NextResponse } from "next/server";
import { ProductScraper } from "@/lib/scraper/product-scraper";

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  try {
    const product = await ProductScraper.scrape(url);
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}
