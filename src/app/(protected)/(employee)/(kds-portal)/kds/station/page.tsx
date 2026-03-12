"use client";

import { Flame, Wine } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { KDSStationCard } from "@/components/features/kds/KDSStationCard";
import { UI_TEXT } from "@/lib/UI_Text";
import { KDSStation } from "@/types/enums";

export default function StationSelectionPage() {
  const router = useRouter();

  // Mock data matching the design, ideally fetched from an API
  const stations = [
    {
      id: KDSStation.Kitchen,
      title: UI_TEXT.KDS.STATIONS.KITCHEN,
      icon: <Flame className="h-8 w-8" />,
      waitingItems: 12,
      statusText: UI_TEXT.KDS.STATIONS.STATUS_HIGH,
      statusVariant: "critical" as const,
      // gradientClass: "bg-gradient-to-br from-primary dark:from-orange-500/10 to-transparent",
    },
    {
      id: KDSStation.Bar,
      title: UI_TEXT.KDS.STATIONS.BAR,
      icon: <Wine className="h-8 w-8" />,
      waitingItems: 5,
      statusText: UI_TEXT.KDS.STATIONS.STATUS_NORMAL,
      statusVariant: "normal" as const,
      // gradientClass: "bg-gradient-to-br from-blue-50/80 dark:from-blue-500/10 to-transparent",
    },
  ];

  const handleStationSelect = (stationId: string) => {
    router.push(`/kds?station=${stationId}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <h1 className="text-foreground text-3xl md:text-4xl font-black leading-tight text-center font-display mb-4 uppercase tracking-tighter">
          {UI_TEXT.KDS.NAV.STATION_SELECTION}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {stations.map((station) => (
            <KDSStationCard
              key={station.id}
              title={station.title}
              icon={station.icon}
              waitingItems={station.waitingItems}
              statusText={station.statusText}
              statusVariant={station.statusVariant}
              onClick={() => handleStationSelect(station.id)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm border border-border text-[10px] text-muted-foreground font-black uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>{UI_TEXT.KDS.STATIONS.SYSTEM_ONLINE}</span>
            <span className="mx-1 text-slate-300">{UI_TEXT.COMMON.BULLET}</span>
            <span>{UI_TEXT.KDS.VERSION}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
