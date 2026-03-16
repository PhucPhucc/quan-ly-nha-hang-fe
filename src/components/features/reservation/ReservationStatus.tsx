import { CheckCircle, Clock, Users, XCircle } from "lucide-react";
import React from "react";

import { Card } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

interface ReservationStatusProps {
  total?: number;
  booked?: number;
  checkedIn?: number;
  cancelled?: number;
}

export const ReservationStatus = ({
  total = 0,
  booked = 0,
  checkedIn = 0,
  cancelled = 0,
}: ReservationStatusProps) => {
  const stats = [
    {
      title: UI_TEXT.RESERVATION.STATS_TOTAL,
      value: total,
      icon: Users,
      colorClass: "text-indigo-600",
      cardBg: "bg-indigo-50/40",
      iconBg: "bg-indigo-100/50",
      borderColor: "border-indigo-100/50",
    },
    {
      title: UI_TEXT.RESERVATION.STATS_BOOKED,
      value: booked,
      icon: Clock,
      colorClass: "text-amber-600",
      cardBg: "bg-amber-50/40",
      iconBg: "bg-amber-100/50",
      borderColor: "border-amber-100/50",
    },
    {
      title: UI_TEXT.RESERVATION.STATS_ARRIVED,
      value: checkedIn,
      icon: CheckCircle,
      colorClass: "text-emerald-600",
      cardBg: "bg-emerald-50/40",
      iconBg: "bg-emerald-100/50",
      borderColor: "border-emerald-100/50",
    },
    {
      title: UI_TEXT.RESERVATION.STATS_CANCELLED,
      value: cancelled,
      icon: XCircle,
      colorClass: "text-rose-600",
      cardBg: "bg-rose-50/40",
      iconBg: "bg-rose-100/50",
      borderColor: "border-rose-100/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`p-6 border ${stat.borderColor} ${stat.cardBg} shadow-sm rounded-3xl flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-1`}
        >
          <div className={`p-4 rounded-2xl ${stat.iconBg} flex items-center justify-center`}>
            <stat.icon className={`h-7 w-7 ${stat.colorClass}`} />
          </div>

          <div className="flex flex-col">
            <p
              className={`text-[11px] font-black ${stat.colorClass} mb-0.5 uppercase tracking-widest opacity-80`}
            >
              {stat.title}
            </p>
            <p className="text-3xl font-black text-slate-800 leading-none">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
