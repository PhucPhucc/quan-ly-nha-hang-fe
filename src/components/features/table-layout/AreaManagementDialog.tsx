"use client";

import { Plus, Save, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { tableService } from "@/services/tableService";
import { Area, AreaStatus, AreaType } from "@/types/Table-Layout";

import EditAreaDialog from "./EditAreaDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  areas: Area[];
  onUpdate: (areas: Area[]) => void;
}

export default function AreaManagementDialog({ open, onClose, areas, onUpdate }: Props) {
  const [search, setSearch] = useState("");

  // Add form
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<AreaType>(AreaType.Normal);
  const [newDesc, setNewDesc] = useState("");

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

  const handleAdd = async () => {
    if (!newName.trim() || !newCode.trim()) return;
    try {
      const response = await tableService.createArea({
        name: newName.trim(),
        codePrefix: newCode.trim().toUpperCase(),
        type: newType,
        description: newDesc.trim() || undefined,
      });

      if (response.isSuccess) {
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
        await refreshAreas();
        setNewName("");
        setNewCode("");
        setNewType(AreaType.Normal);
        setNewDesc("");
      }
    } catch (error) {
      console.error("Failed to add area:", error);
      toast.error(UI_TEXT.COMMON.UPDATE_ERROR);
    }
  };

  const handleToggle = async (areaId: string, currentIsActive: boolean) => {
    try {
      const response = await tableService.updateAreaStatus(areaId, !currentIsActive);
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
          <div className="flex-1 overflow-auto px-6 pb-2">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr>
                  {[
                    { label: "MÃ KHU VỰC", align: "" },
                    { label: "TÊN KHU VỰC", align: "" },
                    { label: "LOẠI", align: "" },
                    { label: "SỐ BÀN", align: "text-center" },
                    { label: "TRẠNG THÁI", align: "" },
                    { label: "THAO TÁC", align: "text-right" },
                  ].map(({ label, align }) => (
                    <th
                      key={label}
                      className={`border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${align}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((area) => {
                  const isActive = area.status === AreaStatus.Active;
                  const isVip = area.type === AreaType.VIP;

                  return (
                    <tr
                      key={area.areaId}
                      className={`transition-colors hover:bg-slate-50 ${!isActive ? "bg-slate-50/50" : ""}`}
                    >
                      <td
                        className={`px-4 py-3 font-medium ${isActive ? "text-slate-900" : "text-slate-500"}`}
                      >
                        {area.codePrefix}
                      </td>
                      <td className={`px-4 py-3 ${!isActive ? "text-slate-500" : ""}`}>
                        {area.name}
                      </td>
                      <td className="px-4 py-3">
                        {isVip ? (
                          <span className="inline-flex items-center rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                            {UI_TEXT.TABLE.TYPE_VIP}
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium ${isActive ? "text-slate-800" : "text-slate-600 opacity-70"}`}
                          >
                            {UI_TEXT.TABLE.TYPE_NORMAL}
                          </span>
                        )}
                      </td>
                      <td className={`px-4 py-3 text-center ${!isActive ? "text-slate-500" : ""}`}>
                        —
                      </td>
                      <td className="px-4 py-3">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                            {UI_TEXT.TABLE.STATUS_ACTIVE}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            {UI_TEXT.TABLE.STATUS_INACTIVE}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEditClick(area)}
                            className="text-xs font-medium uppercase tracking-wide text-slate-500 transition-colors hover:text-primary"
                          >
                            {UI_TEXT.BUTTON.EDIT.toUpperCase()}
                          </button>
                          <span className="text-slate-300">|</span>
                          {isActive ? (
                            <button
                              onClick={() => handleToggle(area.areaId, true)}
                              className="text-xs font-medium uppercase tracking-wide text-danger transition-colors hover:text-red-700"
                            >
                              {UI_TEXT.TABLE.DEACTIVATE.toUpperCase()}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggle(area.areaId, false)}
                              className="text-xs font-medium uppercase tracking-wide text-blue-600 transition-colors hover:text-blue-800"
                            >
                              {UI_TEXT.TABLE.ACTIVATE.toUpperCase()}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add form — luôn mở */}
          <div className="border-t bg-[oklch(0.985_0.002_240)] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                {UI_TEXT.TABLE.ADD_AREA}
              </h3>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-600">
                  {UI_TEXT.TABLE.AREA_NAME} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder={UI_TEXT.TABLE.AREA_NAME_PLACEHOLDER}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="block h-9 w-full rounded border border-slate-200 px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-600">
                  {UI_TEXT.TABLE.AREA_CODE} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder={UI_TEXT.TABLE.AREA_CODE_PLACEHOLDER}
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="block h-9 w-full rounded border border-slate-200 px-3 text-sm uppercase shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="text-[10px] italic text-slate-400">
                  {UI_TEXT.TABLE.AREA_CODE_UNIQUE}
                </p>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-600">
                  {UI_TEXT.TABLE.AREA_TYPE}
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as AreaType)}
                  className="block h-9 w-full rounded border border-slate-200 px-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value={AreaType.Normal}>{UI_TEXT.TABLE.TYPE_NORMAL}</option>
                  <option value={AreaType.VIP}>{UI_TEXT.TABLE.TYPE_VIP}</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-600">
                  {UI_TEXT.TABLE.AREA_DESCRIPTION}
                </label>
                <input
                  type="text"
                  placeholder={UI_TEXT.TABLE.AREA_DESC_PLACEHOLDER}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="block h-9 w-full rounded border border-slate-200 px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                {UI_TEXT.COMMON.CANCEL}
              </button>
              <button
                onClick={handleAdd}
                disabled={!newName.trim() || !newCode.trim()}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {UI_TEXT.TABLE.SAVE_CHANGES}
              </button>
            </div>
          </div>
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
