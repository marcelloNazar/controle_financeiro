import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import { FinanceProvider } from "@/providers/FinanceProvider";

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
      <AuthProvider>
        <FinanceProvider>
          <body
            className={`inter.className overflow-hidden max-w-6xl px-2 h-screen mx-auto flex flex-col bg-gray-950 text-gray-400 `}
          >
            <Header />
            {children}
          </body>
        </FinanceProvider>
      </AuthProvider>
    </html>
  );
}
