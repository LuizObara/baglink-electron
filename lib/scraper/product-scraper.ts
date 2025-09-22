import puppeteer from "puppeteer";
import { ScrapedProduct } from "@/types/scraped-product";

export class ProductScraper {
  static async scrape(url: string): Promise<ScrapedProduct> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    const data = await page.evaluate(() => {
      const getMetaContent = (selector: string) =>
        document.querySelector<HTMLMetaElement>(selector)?.content || null;

      const title =
        document.querySelector("h1")?.textContent ||
        document.title ||
        getMetaContent('meta[property="og:title"]');

      const priceText =
        document.querySelector("[itemprop=price]")?.getAttribute("content") ||
        document.querySelector(".price, .a-price-whole, .product-price")?.textContent;

      const price = priceText
        ? parseFloat(priceText.replace(/[^\d.,]/g, "").replace(",", "."))
        : null;

      const discountText =
        document.querySelector(".discount, .sale-price")?.textContent;
      const discountPrice = discountText
        ? parseFloat(discountText.replace(/[^\d.,]/g, "").replace(",", "."))
        : null;

      const description =
        document.querySelector("meta[name=description]")?.getAttribute("content") ||
        document.querySelector(".product-description")?.textContent ||
        null;

      const images = Array.from(
        document.querySelectorAll<HTMLImageElement>(
          "img[src], meta[property='og:image']"
        )
      )
        .map((el) => el.src || (el as any).content)
        .filter(Boolean);

      return {
        title: title?.trim() || null,
        price,
        discountPrice,
        currency: getMetaContent('meta[itemprop="priceCurrency"]') || "BRL",
        description: description?.trim() || null,
        images,
      };
    });

    await browser.close();

    return {
      ...data,
      url,
      scrapedAt: new Date().toISOString(),
    };
  }
}
