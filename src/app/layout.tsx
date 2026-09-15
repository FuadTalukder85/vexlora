import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query/provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Vexlora",
    template: "%s | Vexlora Marketplace",
  },
  description:
    "Explore curated products from verified independent vendors and artisan creators on the Vexlora multi-vendor e-commerce platform.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-primary antialiased">
        <QueryProvider>
          {/* Modern Responsive Header / Navbar (Full Width) */}
          <Header />

          {/* Main Content Area (Full Width, with optional 1800px max/min width support) */}
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>

          {/* Modern Responsive Footer (Full Width) */}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
