import "./globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "sonner";

import { BrandingDocumentSync } from "@/components/features/branding/BrandingDocumentSync";
import { fetchBrandingSettingsServer } from "@/lib/branding-metadata";
import { LanguageProvider } from "@/providers/LanguageProvider";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/store/ThemeContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultMetadata: Metadata = {
  title: "FoodHub | Premium Restaurant Management",
  description:
    "The all-in-one solution for modern restaurant operations, inventory, and staff management.",
};

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await fetchBrandingSettingsServer();

  return {
    title: branding?.appTitle || defaultMetadata.title,
    description: defaultMetadata.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = await fetchBrandingSettingsServer();

  return (
    <html lang={branding?.language || "en"} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LanguageProvider>
            <QueryProvider>
              <BrandingDocumentSync />
              <Toaster position="top-center" richColors />
              {children}
            </QueryProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
