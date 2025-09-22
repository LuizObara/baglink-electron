import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";

export const dynamic = 'force-dynamic'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
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

  // const profile = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex justify-center flex-1">
              <div className="max-w-6xl 2xl:max-w-7xl container">{children}</div>
            </main>
            <Toaster />
            <Footer className="mt-auto" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}