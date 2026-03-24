"use client";

import { useEffect, useState } from "react";

import AreaManagementDialog from "@/components/features/table-layout/AreaManagementDialog";
import TableLayoutGrid from "@/components/features/table-layout/TableLayoutGrid";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { UI_TEXT } from "@/lib/UI_Text";
import { useTableStore } from "@/store/useTableStore";

export default function TableLayoutPage() {
  const { areas, selectedAreaId, isLoading, fetchAreas, fetchTablesByArea } = useTableStore();
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);

  // Fetch areas on mount
  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  // Fetch tables when area changes
  useEffect(() => {
    if (!selectedAreaId) return;
    fetchTablesByArea(selectedAreaId);
  }, [selectedAreaId, fetchTablesByArea]);

  const selectedArea = areas.find((a) => a.areaId === selectedAreaId);

  if (isLoading && areas.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full p-3">
      {selectedArea ? (
        <TableLayoutGrid area={selectedArea} onManageAreas={() => setAreaDialogOpen(true)} />
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500">
          <p>{UI_TEXT.TABLE.SELECTED_AREA_PLEASE}</p>
        </div>
      )}

      <AreaManagementDialog
        open={areaDialogOpen}
        onClose={() => setAreaDialogOpen(false)}
        areas={areas}
        onUpdate={() => {
          fetchAreas();
        }}
      />
    </div>
  );
}
