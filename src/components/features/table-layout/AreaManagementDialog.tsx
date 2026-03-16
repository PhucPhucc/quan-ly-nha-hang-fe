"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { tableService } from "@/services/tableService";
import { Area } from "@/types/Table-Layout";

import AddAreaForm from "./AddAreaForm";
import AreaManagementTable from "./AreaManagementTable";
import EditAreaDialog from "./EditAreaDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  areas: Area[];
  onUpdate: (areas: Area[]) => void;
}

export default function AreaManagementDialog({ open, onClose, areas, onUpdate }: Props) {
  const [search, setSearch] = useState("");

  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const filtered = areas.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.codePrefix.toLowerCase().includes(search.toLowerCase())
  );

  const refreshAreas = async () => {
    try {
      const response = await tableService.getAreas();
      if (response.isSuccess && response.data) {
        onUpdate(response.data);
      }
    } catch (error) {
      console.error("Failed to refresh areas:", error);
    }
  };

  const handleToggle = async (areaId: string, shouldActivate: boolean) => {
    try {
      const response = await tableService.updateAreaStatus(areaId, shouldActivate);
      if (response.isSuccess) {
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
        await refreshAreas();
      }
    } catch (error) {
      console.error("Failed to toggle area:", error);
      toast.error(UI_TEXT.COMMON.UPDATE_ERROR);
    }
  };

  const handleEditClick = (area: Area) => {
    setEditingArea(area);
    setEditDialogOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-5xl sm:max-w-5xl flex-col overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
            {UI_TEXT.TABLE.MANAGE_AREAS}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-10 rounded-lg"
                placeholder="Tìm kiếm khu vực..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <AreaManagementTable
            areas={filtered}
            onEditClick={handleEditClick}
            onToggleStatus={handleToggle}
          />

          {/* Add form — luôn mở */}
          <AddAreaForm onSuccess={refreshAreas} onClose={onClose} />
        </div>

        {/* Edit Area Dialog */}
        <EditAreaDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingArea(null);
          }}
          area={editingArea}
          onSuccess={refreshAreas}
        />
      </DialogContent>
    </Dialog>
  );
}
