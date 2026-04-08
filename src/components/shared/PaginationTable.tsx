import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";

import { Button } from "../ui/button";

const PaginationTable = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="px-6 py-2 flex items-center justify-between bg-muted/20 shrink-0">
      <div className="flex items-center">
        <span className="font-medium text-foreground">
          {UI_TEXT.BUTTON.PAGE}
          {UI_TEXT.COMMON.COLON}
        </span>
        <div className="flex items-center justify-center min-w-12">
          <span className="font-bold text-foreground">{currentPage}</span>
          <span className="text-foreground mx-1">{UI_TEXT.COMMON.SLASH}</span>
          <span className="font-medium text-foreground/80">{totalPages}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="outline"
          className="h-8 shadow-sm transition-all hover:shadow-md"
        >
          {UI_TEXT.BUTTON.PREV_PAGE}
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          variant="outline"
          disabled={currentPage >= totalPages}
          className="h-8 shadow-sm transition-all hover:shadow-md"
        >
          {UI_TEXT.BUTTON.NEXT_PAGE}
        </Button>
      </div>
    </div>
  );
};

export default PaginationTable;
