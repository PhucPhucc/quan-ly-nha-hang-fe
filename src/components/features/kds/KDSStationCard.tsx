import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface KDSStationCardProps {
  title: string;
  icon: React.ReactNode;
  waitingItems: number;
  statusText: string;
  statusVariant: "critical" | "normal";
  gradientClass: string;
  onClick: () => void;
}

export const KDSStationCard = ({
  title,
  icon,
  waitingItems,
  statusText,
  statusVariant,
  gradientClass,
  onClick,
}: KDSStationCardProps) => {
  return (
    <div
      className="group relative flex flex-col gap-6 rounded-xl bg-card p-6 shadow-sm hover:shadow-md border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between z-10">
        <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
            statusVariant === "critical"
              ? "bg-red-50 text-red-700 border-red-100 animate-pulse"
              : "bg-green-50 text-green-700 border-green-100"
          )}
        >
          {statusText}
        </span>
      </div>

      <div className="space-y-2 z-10">
        <h3 className="text-xl font-bold text-foreground font-display">{title}</h3>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="material-symbols-outlined text-lg">receipt_long</span>
          <p className="text-sm font-medium">{waitingItems} món đang đợi</p>
        </div>
      </div>

      <div className="mt-auto pt-4 z-10 pointer-events-none">
        <div className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-primary group-hover:bg-primary-hover text-white text-sm font-bold tracking-wide transition-all duration-200 shadow-sm group-hover:shadow-md">
          <span>VÀO TRẠM</span>
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>

      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none opacity-50 transition-opacity duration-300 group-hover:opacity-100",
          gradientClass
        )}
      ></div>
    </div>
  );
};
