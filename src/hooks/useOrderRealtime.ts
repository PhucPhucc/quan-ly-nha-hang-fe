"use client";

import * as signalR from "@microsoft/signalr";
import { useEffect } from "react";

import { useOrderBoardStore } from "@/store/useOrderStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const KDS_GROUPS = ["Kitchen", "HotKitchen", "ColdKitchen", "Bar"] as const;

export const useOrderRealtime = () => {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/kds`)
      .withAutomaticReconnect()
      .build();

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const refreshOrders = () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      refreshTimer = setTimeout(() => {
        const { fetchOrders, fetchOrderDetails, selectedOrderId } = useOrderBoardStore.getState();

        void fetchOrders();

        if (selectedOrderId) {
          void fetchOrderDetails(selectedOrderId);
        }
      }, 150);
    };

    const joinGroups = async () => {
      for (const group of KDS_GROUPS) {
        await connection.invoke("JoinStationGroup", group);
      }
    };

    const leaveGroups = async () => {
      for (const group of KDS_GROUPS) {
        await connection.invoke("LeaveStationGroup", group);
      }
    };

    connection.on("OrderItemStatusChanged", refreshOrders);
    connection.on("OrderStatusChanged", refreshOrders);
    connection.onreconnected(async () => {
      try {
        await joinGroups();
        refreshOrders();
      } catch (error) {
        console.error("SignalR: Failed to rejoin order realtime groups", error);
      }
    });

    const start = async () => {
      try {
        await connection.start();
        if (disposed) return;

        await joinGroups();
      } catch (error) {
        console.error("SignalR: Failed to connect order realtime hub", error);
      }
    };

    void start();

    return () => {
      disposed = true;
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      const stop = async () => {
        try {
          if (connection.state === signalR.HubConnectionState.Connected) {
            await leaveGroups();
            await connection.stop();
          }
        } catch (error) {
          console.error("SignalR: Failed to stop order realtime hub", error);
        }
      };

      void stop();
    };
  }, []);
};
