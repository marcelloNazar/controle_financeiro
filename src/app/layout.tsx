import Header from "@/components/partials/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Controle Financeiro",
  description: "By Marcello Nazar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={`inter.className overflow-hidden max-w-6xl px-2 h-screen mx-auto flex flex-col bg-gray-950 text-gray-400 `}
        >
          <header>
            <Header />
          </header>
          <main className="flex flex-1 justify-center items-center">
            {children}
          </main>
        </body>
      </Providers>
    </html>
  );
}
