"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";

import { KDSOrderGrid } from "@/components/features/kds/KDSOrderGrid";
import { KDSQueueSidebar } from "@/components/features/kds/KDSQueueSidebar";
import { useKdsSignalR } from "@/hooks/useKdsSignalR";
import { useKdsStore } from "@/store/useKdsStore";
import { KDSStation } from "@/types/enums";

const getStationEnum = (str: string): KDSStation => {
  if (!str) return KDSStation.Kitchen;

  const normalized = str.toLowerCase();
  switch (normalized) {
    case "bar":
      return KDSStation.Bar;
    case "coldkitchen":
      return KDSStation.ColdKitchen;
    case "hotkitchen":
      return KDSStation.HotKitchen;
    case "kitchen":
    default:
      return KDSStation.Kitchen;
  }
};

export function KDSDashboardClient() {
  const params = useParams();
  const stationParam = params.station as string;
  const station = getStationEnum(stationParam);

  const setStation = useKdsStore((s) => s.setStation);
  const fetchKdsData = useKdsStore((s) => s.fetchKdsData);

  // Initialize SignalR connection
  useKdsSignalR();

  useEffect(() => {
    setStation(station);
    const fetchData = async () => {
      await fetchKdsData(station);
    };
    fetchData();
  }, [station, setStation, fetchKdsData]);

  return (
    <div className="flex h-full overflow-x-hidden flex-1 min-w-0">
      <KDSQueueSidebar />
      <KDSOrderGrid />
    </div>
  );
}
