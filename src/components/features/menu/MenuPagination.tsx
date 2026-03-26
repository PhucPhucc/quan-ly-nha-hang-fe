import React from "react";

import PaginationTable from "@/components/shared/PaginationTable";
import { useMenuStore } from "@/store/useMenuStore";

export const MenuPagination = () => {
  const { currentPage, totalPages, setCurrentPage } = useMenuStore();

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  console.log(currentPage, totalPages);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <PaginationTable
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};

export default MenuPagination;
