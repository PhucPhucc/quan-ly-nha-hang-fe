import React from "react";

const BackgroundDot = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex-1 overflow-auto">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(oklch(0.8 0.005 240) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {children}
    </div>
  );
};

export default BackgroundDot;
