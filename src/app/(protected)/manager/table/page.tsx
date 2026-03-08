"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import AreaManagementDialog from "@/components/features/table-layout/AreaManagementDialog";
import AreaTabs from "@/components/features/table-layout/AreaTabs";
import TableLayoutGrid from "@/components/features/table-layout/TableLayoutGrid";
import { UI_TEXT } from "@/lib/UI_Text";
import { tableService } from "@/services/tableService";
import { Area, AreaStatus, Table } from "@/types/Table-Layout";

export default function TableLayoutPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch areas on mount
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        const response = await tableService.getAreas();
        if (response.isSuccess && response.data) {
          setAreas(response.data);

          const activeAreas = response.data.filter((a) => a.status === AreaStatus.Active);
          if (activeAreas.length > 0 && !selectedAreaId) {
            setSelectedAreaId(activeAreas[0].areaId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch areas:", error);
        toast.error("Không thể tải danh sách khu vực");
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, [selectedAreaId]);

  // Fetch tables when area changes
  useEffect(() => {
    if (!selectedAreaId) return;

    const fetchTables = async () => {
      try {
        const response = await tableService.getTablesByArea(selectedAreaId);
        if (response.isSuccess && response.data) {
          setTables(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch tables:", error);
        toast.error("Không thể tải danh sách bàn");
      }
    };
    fetchTables();
  }, [selectedAreaId]);

  const selectedArea = areas.find((a) => a.areaId === selectedAreaId);

  if (loading && areas.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <AreaTabs
        areas={areas}
        selectedAreaId={selectedAreaId}
        onSelectArea={setSelectedAreaId}
        onManageAreas={() => setAreaDialogOpen(true)}
      />

      {selectedArea ? (
        <TableLayoutGrid area={selectedArea} tables={tables} />
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500">
          <p>{UI_TEXT.TABLE.SELECTED_AREA_PLEASE}</p>
        </div>
      )}

      <AreaManagementDialog
        open={areaDialogOpen}
        onClose={() => setAreaDialogOpen(false)}
        areas={areas}
        onUpdate={setAreas}
      />
    </div>
  );
}
