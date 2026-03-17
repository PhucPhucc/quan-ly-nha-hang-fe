import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const MenuPagination = () => {
  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <Button size="icon-sm" variant="outline">
            <ChevronLeft className="size-4" />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#"></PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive></PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#"></PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <Button size="icon-sm" variant="outline">
            <ChevronRight className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default MenuPagination;
