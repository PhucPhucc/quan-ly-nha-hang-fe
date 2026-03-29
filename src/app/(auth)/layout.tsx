import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { ThemeProvider } from "@/store/ThemeContext";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ThemeProvider>
      <div className="min-h-screen w-full bg-white relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
            backgroundSize: "40px 40px",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)",
            maskImage: "radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)",
          }}
        />
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="max-w-sm min-w-xs lg:w-sm">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-primary text-shadow-xl mb-2"
            >
              <UtensilsCrossed />
              <span className="font-serif font-bold text-4xl">{UI_TEXT.COMMON.NAME_PROJECT}</span>
            </Link>
            {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default layout;
