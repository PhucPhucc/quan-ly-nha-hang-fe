import React from "react";

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
