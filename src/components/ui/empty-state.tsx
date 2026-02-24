import { LucideIcon } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon: Icon, className, action }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center space-y-4 p-8 text-center animate-in fade-in-50",
        className
      )}
    >
      {Icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 p-4">
          <Icon className="h-10 w-10 text-muted-foreground/50" />
        </div>
      )}
      <div className="space-y-2 max-w-sm">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
