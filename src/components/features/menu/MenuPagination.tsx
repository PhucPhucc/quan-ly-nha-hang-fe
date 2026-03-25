import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { useMenuStore } from "@/store/useMenuStore";

export const MenuPagination = () => {
  const { currentPage, totalPages, totalItems, setCurrentPage, pageSize } = useMenuStore();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            className="cursor-pointer hover:bg-primary/10 transition-colors"
          >
            {1}
          </PaginationLink>
        </PaginationItem>
      );
      if (start > 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
            className={cn(
              "cursor-pointer transition-all duration-200",
              currentPage === i
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "hover:bg-primary/10"
            )}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            className="cursor-pointer hover:bg-primary/10 transition-colors"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-border/50">
      <div className="text-sm text-muted-foreground order-2 sm:order-1 select-none">
        {UI_TEXT.COMMON.PAGINATION_SHOWING}{" "}
        <span className="font-medium text-foreground">
          {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
        </span>{" "}
        {UI_TEXT.COMMON.TO}{" "}
        <span className="font-medium text-foreground">
          {Math.min(currentPage * pageSize, totalItems)}
        </span>{" "}
        {UI_TEXT.COMMON.OF} <span className="font-medium text-foreground">{totalItems}</span>{" "}
        {UI_TEXT.MENU.TAB_ITEM.toLowerCase()}
      </div>

      <Pagination className="justify-center sm:justify-end order-1 sm:order-2">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="hidden sm:flex rounded-lg hover:bg-primary/10 disabled:opacity-50"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg hover:bg-primary/10 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </PaginationItem>

          {renderPageNumbers()}

          <PaginationItem>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg hover:bg-primary/10 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="hidden sm:flex rounded-lg hover:bg-primary/10 disabled:opacity-50"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default MenuPagination;
