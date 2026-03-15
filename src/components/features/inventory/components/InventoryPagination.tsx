import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

type Props = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export function InventoryPagination({ currentPage, totalPages, onPrev, onNext }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/10 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {UI_TEXT.INVENTORY.TABLE.PAGE}
        </span>
        <div className="flex items-center justify-center px-3 py-1 rounded-lg bg-background border shadow-sm">
          <span className="text-sm font-bold">{currentPage}</span>
          <span className="text-muted-foreground mx-1.5 opacity-50">
            {UI_TEXT.INVENTORY.TABLE.SLASH}
          </span>
          <span className="text-sm font-medium text-muted-foreground/70">{totalPages}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={currentPage <= 1}
          className="rounded-lg h-9"
        >
          {UI_TEXT.COMMON.PREVIOUS}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="rounded-lg h-9"
        >
          {UI_TEXT.COMMON.NEXT}
        </Button>
      </div>
    </div>
  );
}
