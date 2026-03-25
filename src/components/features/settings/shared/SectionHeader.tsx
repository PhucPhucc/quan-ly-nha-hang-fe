import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export function SectionHeader({ icon, title, description }: Props) {
  return (
    <div className="flex items-start gap-3 pb-2">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
