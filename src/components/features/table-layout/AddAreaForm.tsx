import { Plus, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import { tableService } from "@/services/tableService";
import { AreaType } from "@/types/Table-Layout";

interface Props {
  onSuccess: () => Promise<void>;
  onClose: () => void;
}

export default function AddAreaForm({ onSuccess, onClose }: Props) {
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<AreaType>(AreaType.Normal);
  const [newDesc, setNewDesc] = useState("");

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
        await onSuccess();
        setNewName("");
        setNewCode("");
        setNewType(AreaType.Normal);
        setNewDesc("");
      }
    } catch (error: unknown) {
      console.error("Failed to add area:", error);
      toast.error((error as Error).message || UI_TEXT.COMMON.UPDATE_ERROR);
    }
  };

  return (
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
            {UI_TEXT.TABLE.AREA_NAME} <span className="text-danger">{UI_TEXT.COMMON.ASTERISK}</span>
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
            {UI_TEXT.TABLE.AREA_CODE} <span className="text-danger">{UI_TEXT.COMMON.ASTERISK}</span>
          </label>
          <input
            type="text"
            placeholder={UI_TEXT.TABLE.AREA_CODE_PLACEHOLDER}
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
            className="block h-9 w-full rounded border border-slate-200 px-3 text-sm uppercase shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-[10px] italic text-slate-400">{UI_TEXT.TABLE.AREA_CODE_UNIQUE}</p>
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
  );
}
