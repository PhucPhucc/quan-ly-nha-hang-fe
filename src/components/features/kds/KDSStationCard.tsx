import { ArrowRight } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

interface KDSStationCardProps {
  title: string;
  icon: React.ReactNode;
  waitingItems: number;
  onClick: () => void;
}

export const KDSStationCard = ({ title, icon, waitingItems, onClick }: KDSStationCardProps) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all duration-200 max-w-md"
    >
      <div className="flex items-center gap-3 pb-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15">
          {icon}
        </div>
        <div className="space-y-1">
          <div className="text-lg font-bold leading-tight text-foreground">{title}</div>
          <div className="text-sm font-semibold text-foreground">
            {waitingItems} {UI_TEXT.KDS.ITEM.WAITING_SUFFIX}
          </div>
        </div>
      </div>

      <Button className="w-full gap-2" variant="default">
        <span>{UI_TEXT.KDS.NAV.STATION}</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
