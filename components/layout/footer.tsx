import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4",
        className
      )}
    >
      <p>
        Powered by{" "}
        <a
          href="https://github.com/LuizObara"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          LuizObara
        </a>
      </p>
      <ThemeSwitcher />
    </footer>
  );
}