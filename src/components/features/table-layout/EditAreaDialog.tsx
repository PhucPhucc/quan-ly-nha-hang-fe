"use client";

import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { tableService } from "@/services/tableService";
import { Area, AreaType } from "@/types/Table-Layout";

interface Props {
    open: boolean;
    onClose: () => void;
    area: Area | null;
    onSuccess: () => void;
}

export default function EditAreaDialog({ open, onClose, area, onSuccess }: Props) {
    const [name, setName] = useState("");
    const [codePrefix, setCodePrefix] = useState("");
    const [type, setType] = useState<AreaType>(AreaType.Normal);
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (area) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName(area.name);

            setCodePrefix(area.codePrefix);

            setType(area.type);

            setDescription(area.description || "");
        }
    }, [area]);

    const handleSave = async () => {
        if (!area || !name.trim() || !codePrefix.trim()) return;

        try {
            const response = await tableService.updateArea(area.areaId, {
                areaId: area.areaId,
                name: name.trim(),
                codePrefix: codePrefix.trim().toUpperCase(),
                type,
                description: description.trim() || undefined,
            });

            if (response.isSuccess) {
                toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error("Failed to update area:", error);
            toast.error(UI_TEXT.COMMON.UPDATE_ERROR);
        }
    };

    if (!area) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-slate-200 dark:border-slate-800">
                <DialogHeader className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between bg-white dark:bg-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Save className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {UI_TEXT.TABLE.AREA_UPDATE}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-5">
                    {/* Area Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {UI_TEXT.TABLE.AREA_NAME}
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên khu vực"
                            className="h-12"
                        />
                    </div>

                    {/* Area Code (Read-only) */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {UI_TEXT.TABLE.AREA_CODE}
                        </label>
                        <div className="relative">
                            <Input
                                value={codePrefix}
                                onChange={(e) => setCodePrefix(e.target.value.toUpperCase())}
                                className="h-12 pr-10"
                                placeholder={UI_TEXT.TABLE.AREA_CODE_PLACEHOLDER}
                            />
                        </div>
                    </div>

                    {/* Type Dropdown */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {UI_TEXT.TABLE.AREA_TYPE}
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as AreaType)}
                            className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: "right 0.5rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1.5em 1.5em",
                            }}
                        >
                            <option value={AreaType.Normal}>{UI_TEXT.TABLE.TYPE_NORMAL}</option>
                            <option value={AreaType.VIP}>{UI_TEXT.TABLE.TYPE_VIP}</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {UI_TEXT.TABLE.AREA_DESCRIPTION}
                        </label>
                        <textarea
                            className="w-full p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none min-h-[100px]"
                            placeholder={UI_TEXT.TABLE.AREA_DESC_PLACEHOLDER}
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm"
                    >
                        {UI_TEXT.COMMON.CANCEL}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name.trim() || !codePrefix.trim()}
                        className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        {UI_TEXT.COMMON.SAVE}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
