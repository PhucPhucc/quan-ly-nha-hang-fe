import { UtensilsCrossed } from "lucide-react";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='min-h-screen w-full bg-white relative'>
      {/*  Diagonal Cross Bottom Right Fade Grid Background */}
      <div
        className='absolute inset-0'
        style={{
          backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)",
        }}
      />
      {/* Your Content/Components */}
      <div className='relative z-10 flex items-center justify-center h-screen'>
        <div className='max-w-sm min-w-xs lg:w-sm'>
          <div className='flex items-center justify-center gap-2 text-primary text-shadow-xl mb-2'>
            <UtensilsCrossed />
            <span className='font-serif font-bold text-4xl'>FoodHub</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
