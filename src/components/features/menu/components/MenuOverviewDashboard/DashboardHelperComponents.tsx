import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ChecklistRow({
  label,
  value,
  hint,
  isLoading,
  tone = "default",
}: {
  label: string;
  value: string;
  hint: string;
  isLoading: boolean;
  tone?: "default" | "warning";
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {isLoading ? (
        <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
      ) : (
        <Badge
          variant="outline"
          className={cn(
            "border-0",
            tone === "warning" ? "table-pill table-pill-warning" : "table-pill table-pill-primary"
          )}
        >
          {value}
        </Badge>
      )}
    </div>
  );
}

export function OverviewSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-xl bg-muted/70" />
      ))}
    </div>
  );
}

export function EmptyState({ copy }: { copy: string }) {
  return (
    <div className="flex min-h-[168px] items-center justify-center rounded-xl border border-dashed px-4 text-center text-sm text-muted-foreground">
      {copy}
    </div>
  );
}
