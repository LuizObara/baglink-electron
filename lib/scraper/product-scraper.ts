import puppeteer from "puppeteer";
import { ScrapedProduct } from "@/types/scraped-product";

export class ProductScraper {
  static async scrape(url: string): Promise<ScrapedProduct> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });

    const data = await page.evaluate(() => {
      const parsePrice = (priceText: string | null): number | null => {
        if (!priceText) return null;
        const cleanedText = priceText.replace(/[^\d,.]/g, "").replace(".", "").replace(",", ".");
        const price = parseFloat(cleanedText);
        return isNaN(price) ? null : price;
      };

      let priceFromJson = null;
      let currencyFromJson = null;
      try {
        const scriptElement = document.querySelector('script[type="application/ld+json"]');
        if (scriptElement) {
          const jsonData = JSON.parse(scriptElement.textContent || "{}");
          const offers = jsonData.offers || (jsonData.mainEntity ? jsonData.mainEntity.offers : null);
          if (offers) {
            const offer = Array.isArray(offers) ? offers[0] : offers;
            if (offer && (offer.price || offer.lowPrice)) {
              priceFromJson = parsePrice(String(offer.price || offer.lowPrice));
              currencyFromJson = offer.priceCurrency || "BRL";
            }
          }
        }
      } catch (e) {
      }

      const priceSelectors = [
        // IDs comuns
        '#price_inside_buybox', '#our_price_display', '#priceblock_ourprice',
        // Seletores de Microdata/Schema.org
        '[itemprop=price]', '[property="product:price:amount"]',
        // Classes comuns em e-commerces brasileiros e internacionais
        '.price__value', '.price-container .price', '.sales-price', '.product-price',
        '.price', '.preco', '.valor', '.price-tag', '.price-final_price',
        '.a-price-whole', '.main-price', '.product-price--final', '.product-price-value',
        '.final-price', '.product-highlight__price', '.product-price--sale', '.price-current'
      ];

      let priceFromCss = null;
      for (const selector of priceSelectors) {
        const element = document.querySelector<HTMLElement>(selector);
        if (element) {
          const priceText = element.getAttribute('content') || element.textContent;
          const parsed = parsePrice(priceText);
          if (parsed !== null) {
            priceFromCss = parsed;
            break;
          }
        }
      }

      const getMetaContent = (selector: string) => document.querySelector<HTMLMetaElement>(selector)?.content || null;
      
      const title = document.querySelector("h1")?.textContent || document.title || getMetaContent('meta[property="og:title"]');
      const description = getMetaContent('meta[name=description]') || getMetaContent('meta[property="og:description]');
      const images = Array.from(document.querySelectorAll<HTMLImageElement>("img[src], meta[property='og:image']"))
        .map((el) => el.src || (el as any).content)
        .filter(Boolean);

      return {
        title: title?.trim() || null,
        price: priceFromJson || priceFromCss,
        discountPrice: null,
        currency: currencyFromJson || getMetaContent('meta[itemprop="priceCurrency"]') || "BRL",
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