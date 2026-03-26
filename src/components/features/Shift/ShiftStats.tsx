import { AlertTriangle, Clock, UserPlus, Users } from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

interface ShiftStatsProps {
  activeShifts: number;
  staffWorking: number;
  overtimeRisk: number;
  vacantPositions: number;
}

const ShiftStats = ({
  activeShifts,
  staffWorking,
  overtimeRisk,
  vacantPositions,
}: ShiftStatsProps) => {
  const stats = [
    {
      label: UI_TEXT.SHIFT.TOTAL_ACTIVE,
      value: activeShifts,
      subValue: UI_TEXT.SHIFT.STATS_WEEKLY_CHANGE,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      label: UI_TEXT.SHIFT.STAFF_WORKING,
      value: `${staffWorking}%`,
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      progress: staffWorking,
    },
    {
      label: UI_TEXT.SHIFT.OVERTIME_RISK,
      value: overtimeRisk,
      subValue: UI_TEXT.SHIFT.STATS_OVERTIME_WARNING,
      icon: AlertTriangle,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
    },
    {
      label: UI_TEXT.SHIFT.VACANT_POSITIONS,
      value: vacantPositions,
      subValue: UI_TEXT.SHIFT.STATS_UNASSIGNED,
      icon: UserPlus,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="glass-card border-none shadow-sm overflow-hidden group hover:scale-[1.02] transition-all cursor-default"
        >
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-2xl ${stat.bgColor} transition-transform group-hover:rotate-6`}
              >
                <stat.icon size={20} className={stat.color} strokeWidth={2.5} />
              </div>
              {stat.subValue && (
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {stat.subValue}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
            {stat.progress !== undefined && (
              <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.color.replace("text", "bg")} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ShiftStats;
