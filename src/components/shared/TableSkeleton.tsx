import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TableSkeletonProps = {
  columns: number;
  rows?: number;
  className?: string;
  showMediaInFirstColumn?: boolean;
};

const widthPattern = ["w-24", "w-16", "w-20", "w-28", "w-14"];

export default function TableSkeleton({
  columns,
  rows = 6,
  className,
  showMediaInFirstColumn = false,
}: TableSkeletonProps) {
  return (
    <TableShell className={cn("mt-4", className)}>
      <Table>
        <TableHeader>
          <TableRow variant="header">
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead
                key={`head-${index}`}
                className={cn(index === columns - 1 && "text-right")}
              >
                <Skeleton
                  className={cn(
                    "h-3 rounded-full bg-table-skeleton",
                    index === columns - 1
                      ? "ml-auto w-16"
                      : widthPattern[index % widthPattern.length]
                  )}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <TableCell
                  key={`cell-${rowIndex}-${columnIndex}`}
                  className={cn(columnIndex === columns - 1 && "text-right")}
                >
                  {showMediaInFirstColumn && columnIndex === 0 ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-12 rounded-2xl bg-table-skeleton" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-28 rounded-full bg-table-skeleton" />
                        <Skeleton className="h-3 w-40 rounded-full bg-table-skeleton-soft" />
                      </div>
                    </div>
                  ) : (
                    <div className={cn(columnIndex === columns - 1 && "flex justify-end")}>
                      <div className="space-y-2">
                        <Skeleton
                          className={cn(
                            "h-4 rounded-full bg-table-skeleton",
                            columnIndex === columns - 1
                              ? "ml-auto w-14"
                              : widthPattern[(rowIndex + columnIndex) % widthPattern.length]
                          )}
                        />
                        {columnIndex !== columns - 1 && columnIndex % 2 === 0 && (
                          <Skeleton className="h-3 w-16 rounded-full bg-table-skeleton-soft" />
                        )}
                      </div>
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
}
