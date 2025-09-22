import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ColorThief from "color-thief-browser";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getDominantColorFromImage(imageUrl: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = async () => {
      try {
        const colorThief = new ColorThief();
        const rgb = await colorThief.getColor(img);
        resolve(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
      } catch (err) {
        console.error("Erro ao extrair cor:", err);
        resolve(null);
      }
    };

    img.onerror = () => {
      console.error("Erro ao carregar imagem:", imageUrl);
      resolve(null);
    };
  });
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;