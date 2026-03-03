"use client";

import { useState } from "react";

import AreaManagementDialog from "@/components/features/table-layout/AreaManagementDialog";
import AreaTabs from "@/components/features/table-layout/AreaTabs";
import TableLayoutGrid from "@/components/features/table-layout/TableLayoutGrid";
import { mockAreas, mockTables } from "@/data/mockTable";
import { AreaStatus } from "@/types/Table-Layout";

export default function TableLayoutPage() {
  const activeAreas = mockAreas.filter((a) => a.status === AreaStatus.ACTIVE);
  const [selectedAreaId, setSelectedAreaId] = useState(activeAreas[0]?.areaId ?? "");
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);

  const selectedArea = mockAreas.find((a) => a.areaId === selectedAreaId);
  const filteredTables = mockTables.filter((t) => t.areaId === selectedAreaId);

  if (!selectedArea) return null;

  return (
    <div className="flex flex-col gap-4 pt-4">
      <AreaTabs
        areas={mockAreas}
        selectedAreaId={selectedAreaId}
        onSelectArea={setSelectedAreaId}
        onManageAreas={() => setAreaDialogOpen(true)}
      />

      <TableLayoutGrid area={selectedArea} tables={filteredTables} />

      <AreaManagementDialog
        open={areaDialogOpen}
        onClose={() => setAreaDialogOpen(false)}
        areas={mockAreas}
      />
    </div>
  );
}
