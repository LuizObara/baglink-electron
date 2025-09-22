import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client"; 
import { ProductScraper } from "@/lib/scraper/product-scraper";

export async function POST(req: Request) {
  const { url, username } = await req.json();
  const supabase = createClient();

  if (!url || !username) {
    return NextResponse.json({ error: "URL e username são obrigatórios" }, { status: 400 });
  }

  try {
    const scrapedData = await ProductScraper.scrape(url);

    const { data: user } = await supabase.from("users_public").select("id").eq("username", username).single();
    if (!user) {
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const { data: newItem, error } = await supabase
      .from("items")
      .insert({
        url: url,
        username: username,
        id_user: user.id,
        scraped_data: scrapedData 
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(newItem);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Falha ao adicionar e raspar o item" }, { status: 500 });
  }
}