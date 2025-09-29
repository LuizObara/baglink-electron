import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "BagLink",
  description: "BagLink - compartilhe seus links favoritos",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col h-screen">
            <Header className="flex-shrink-0" />
            
            <main className="flex-1 overflow-y-auto flex justify-center">
              <div className="max-w-6xl 2xl:max-w-7xl container w-full">{children}</div>
            </main>
            
            <Toaster />

            <Footer className="flex-shrink-0" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}