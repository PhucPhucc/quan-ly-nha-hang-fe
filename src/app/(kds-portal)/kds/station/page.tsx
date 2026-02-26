"use client";

import { Flame, Wine } from "lucide-react";
import { useRouter } from "next/navigation";

import { KDSStationCard } from "@/components/features/kds/KDSStationCard";

export default function StationSelectionPage() {
  const router = useRouter();

  // Mock data matching the design, ideally fetched from an API
  const stations = [
    {
      id: "kitchen",
      title: "TRẠM BẾP (KITCHEN)",
      icon: <Flame className="h-8 w-8" />,
      waitingItems: 12,
      statusText: "High Activity",
      statusVariant: "critical" as const,
      gradientClass: "bg-gradient-to-br from-orange-50/80 dark:from-orange-500/10 to-transparent",
    },
    {
      id: "bar",
      title: "TRẠM BAR (BAR)",
      icon: <Wine className="h-8 w-8" />,
      waitingItems: 5,
      statusText: "Normal",
      statusVariant: "normal" as const,
      gradientClass: "bg-gradient-to-br from-blue-50/80 dark:from-blue-500/10 to-transparent",
    },
  ];

  const handleStationSelect = (stationId: string) => {
    // We could store the selected station in Zustand or URL params here.
    // For now, redirecting to the main KDS Dashboard which will likely adapt.
    router.push("/kds");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <h1 className="text-foreground text-3xl md:text-4xl font-extrabold leading-tight text-center font-display mb-4">
          CHỌN TRẠM LÀM VIỆC
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
              gradientClass={station.gradientClass}
              onClick={() => handleStationSelect(station.id)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm border border-border text-xs text-muted-foreground font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>System Online</span>
            <span className="mx-1 text-slate-300">•</span>
            <span>v2.4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
