import { Clock, DollarSign, PieChart, Users } from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

interface ScheduleStatsProps {
  totalStaff: number;
  estimatedHours: number;
  estimatedCost: number;
  shiftCoverage: number;
  isLoading?: boolean;
}

const formatCost = (cost: number): string => {
  if (cost >= 1_000_000) {
    return `${(cost / 1_000_000).toFixed(1)}M`;
  }
  if (cost >= 1_000) {
    return `${(cost / 1_000).toFixed(0)}K`;
  }
  return cost.toLocaleString();
};

const ScheduleStats = ({
  totalStaff,
  estimatedHours,
  estimatedCost,
  shiftCoverage,
  isLoading,
}: ScheduleStatsProps) => {
  const stats = [
    {
      label: UI_TEXT.SCHEDULE.TOTAL_STAFF,
      value: totalStaff,
      subValue: UI_TEXT.SCHEDULE.STATS_STAFF_SUB,
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      label: UI_TEXT.SCHEDULE.ESTIMATED_HOURS,
      value: `${estimatedHours}${UI_TEXT.SCHEDULE.HOURS_UNIT}`,
      subValue: UI_TEXT.SCHEDULE.STATS_HOURS_SUB,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: UI_TEXT.SCHEDULE.ESTIMATED_COST,
      value: formatCost(estimatedCost),
      subValue: UI_TEXT.SCHEDULE.STATS_COST_SUB,
      icon: DollarSign,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      label: UI_TEXT.SCHEDULE.SHIFT_COVERAGE,
      value: `${shiftCoverage}%`,
      icon: PieChart,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      progress: shiftCoverage,
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
                <stat.icon className={`size-5 ${stat.color}`} strokeWidth={2.5} />
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
              {isLoading ? (
                <div className="h-9 flex items-center">
                  <div className="h-6 w-16 bg-slate-100 rounded-lg animate-pulse" />
                </div>
              ) : (
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              )}
            </div>
            {stat.progress !== undefined && (
              <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.color.replace("text", "bg")} shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-500`}
                  style={{ width: isLoading ? "0%" : `${stat.progress}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScheduleStats;
