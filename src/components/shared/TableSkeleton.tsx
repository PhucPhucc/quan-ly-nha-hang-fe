"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export default function TableSkeleton({ columns = 5, rows = 5, className }: TableSkeletonProps) {
  const columnArray = Array.from({ length: columns });
  const rowArray = Array.from({ length: rows });

  return (
    <div className={cn("rounded-md border bg-card", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columnArray.map((_, i) => (
              <TableHead key={`head-${i}`}>
                <Skeleton className="mx-auto h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowArray.map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {columnArray.map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
