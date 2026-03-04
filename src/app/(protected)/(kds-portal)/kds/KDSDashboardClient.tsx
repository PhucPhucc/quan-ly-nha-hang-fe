"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

import { KDSOrderGrid } from "@/components/features/kds/KDSOrderGrid";
import { KDSQueueSidebar } from "@/components/features/kds/KDSQueueSidebar";
import { useKdsSignalR } from "@/hooks/useKdsSignalR";
import { useKdsStore } from "@/store/useKdsStore";
import { KDSStation } from "@/types/enums";

export function KDSDashboardClient() {
  const searchParams = useSearchParams();
  const station = (searchParams.get("station") || KDSStation.Kitchen) as KDSStation;

  const setStation = useKdsStore((s) => s.setStation);
  const fetchKdsData = useKdsStore((s) => s.fetchKdsData);

  // Initialize SignalR connection
  useKdsSignalR();

  useEffect(() => {
    setStation(station);
  }, [station, setStation]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchKdsData();
    };
    fetchData();
    // Poll every 10 seconds for testing/simplicity since no SignalR was found
    // const interval = setInterval(fetchKdsData, 10000);
    // return () => clearInterval(interval);
  }, [fetchKdsData]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      <KDSQueueSidebar />
      <KDSOrderGrid />
    </div>
  );
}
