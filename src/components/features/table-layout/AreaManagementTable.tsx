import { UI_TEXT } from "@/lib/UI_Text";
import { Area, AreaStatus, AreaType } from "@/types/Table-Layout";

interface Props {
  areas: Area[];
  onEditClick: (area: Area) => void;
  onToggleStatus: (areaId: string, currentIsActive: boolean) => void;
}

export default function AreaManagementTable({ areas, onEditClick, onToggleStatus }: Props) {
  return (
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
          {areas.map((area) => {
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
                <td className={`px-4 py-3 ${!isActive ? "text-slate-500" : ""}`}>{area.name}</td>
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
                  {area.numberOfTables || 0}
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
                      onClick={() => onEditClick(area)}
                      className="text-xs font-medium uppercase tracking-wide text-slate-500 transition-colors hover:text-primary"
                    >
                      {UI_TEXT.BUTTON.EDIT.toUpperCase()}
                    </button>
                    <span className="text-slate-300">{UI_TEXT.COMMON.PIPE}</span>
                    {isActive ? (
                      <button
                        onClick={() => onToggleStatus(area.areaId, true)}
                        className="text-xs font-medium uppercase tracking-wide text-danger transition-colors hover:text-red-700"
                      >
                        {UI_TEXT.TABLE.DEACTIVATE.toUpperCase()}
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatus(area.areaId, false)}
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
  );
}
