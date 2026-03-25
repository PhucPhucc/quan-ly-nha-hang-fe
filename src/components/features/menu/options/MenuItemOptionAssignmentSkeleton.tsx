import { Card } from "@/components/ui/card";

export const MenuItemOptionAssignmentSkeleton = () => (
  <div className="space-y-4">
    {[1, 2].map((i) => (
      <Card key={i} className="p-4 flex items-center gap-4 border-border/50 animate-pulse">
        <div className="h-10 w-6 bg-muted rounded" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-3 w-48 bg-muted rounded" />
        </div>
        <div className="flex gap-4">
          <div className="h-8 w-12 bg-muted rounded" />
          <div className="h-8 w-16 bg-muted rounded" />
          <div className="h-8 w-16 bg-muted rounded" />
        </div>
      </Card>
    ))}
  </div>
);
