import * as signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";

import { useTableStore } from "@/store/useTableStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const useTableSignalR = () => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const updateTableStatusRealtime = useTableStore((s) => s.updateTableStatusRealtime);

  useEffect(() => {
    // Không cần station như KDS, chỉ cần kết nối vào hub chung của sơ đồ bàn
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/table-status`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR: Connected to Table Status Hub.");

        // Lắng nghe event thay đổi trạng thái bàn
        connection.on("TableStatusChanged", (data: { tableId: string; status: string }) => {
          console.log("SignalR: Table status changed", data);
          updateTableStatusRealtime(data.tableId, data.status);
        });
      } catch (err) {
        console.error("SignalR: Error connecting to Table Status Hub", err);
      }
    };

    startConnection();

    return () => {
      const stopConnection = async () => {
        try {
          if (connection.state === signalR.HubConnectionState.Connected) {
            await connection.stop();
            console.log("SignalR: Disconnected from Table Status Hub.");
          }
        } catch (err) {
          console.error("SignalR: Error stopping connection", err);
        }
      };
      stopConnection();
    };
  }, [updateTableStatusRealtime]);
};
