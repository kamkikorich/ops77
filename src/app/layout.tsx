import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Using Inter and Outfit (Display)
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Simpan & Pantau QR Ops",
  description: "Sistem Pengurusan Ops Kesan Digital PERKESO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body
        className={cn(
          "min-h-screen bg-slate-100 font-sans antialiased dark:bg-slate-950",
          inter.variable,
          outfit.variable
        )}
      >
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900">
          <header className="sticky top-0 z-50 border-b bg-white/80 p-4 backdrop-blur-md dark:bg-slate-900/80">
            <h1 className="font-heading text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sistem QR Ops
            </h1>
          </header>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
