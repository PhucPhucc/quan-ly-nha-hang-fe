import "./globals.css";

import type { Metadata } from "next";
import Script from "next/dist/client/script";
import { Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "sonner";

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

export const metadata: Metadata = {
  title: "FoodHub | Premium Restaurant Management",
  description:
    "The all-in-one solution for modern restaurant operations, inventory, and staff management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          src="https://cdn.jsdelivr.net/npm/qz-tray/qz-tray.js"
          strategy="beforeInteractive"
        />
        <ThemeProvider>
          <QueryProvider>
            <Toaster position="top-center" richColors />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
