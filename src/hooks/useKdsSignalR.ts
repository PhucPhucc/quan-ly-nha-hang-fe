import * as signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useKdsStore } from "@/store/useKdsStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const useKdsSignalR = () => {
  const station = useKdsStore((s) => s.station);
  const fetchKdsData = useKdsStore((s) => s.fetchKdsData);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!station) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/kds`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log(`SignalR: Connected to KDS Hub. Joining station: ${station}`);

        await connection.invoke("JoinStationGroup", station);

        // If 'Kitchen' is selected, also join sub-kitchens to receive their events
        if (station === "Kitchen") {
          await connection.invoke("JoinStationGroup", "HotKitchen");
          await connection.invoke("JoinStationGroup", "ColdKitchen");
        }

        // Set up event listeners
        connection.on("NewOrderItemReceived", (data) => {
          console.log("SignalR: New order item received", data);
          fetchKdsData();
          toast.info("Có món mới vừa được thêm vào hàng đợi!");
        });

        connection.on("OrderItemStatusChanged", (data) => {
          console.log("SignalR: Order item status changed", data);
          fetchKdsData();
        });

        connection.on("OrderStatusChanged", (data) => {
          console.log("SignalR: Order status changed", data);
          fetchKdsData();
        });
      } catch (err) {
        console.error("SignalR: Error connecting to hub", err);
      }
    };

    startConnection();

    return () => {
      const stopConnection = async () => {
        try {
          if (connection.state === signalR.HubConnectionState.Connected) {
            await connection.invoke("LeaveStationGroup", station);
            if (station === "Kitchen") {
              await connection.invoke("LeaveStationGroup", "HotKitchen");
              await connection.invoke("LeaveStationGroup", "ColdKitchen");
            }
            await connection.stop();
            console.log(`SignalR: Left station ${station} and disconnected.`);
          }
        } catch (err) {
          console.error("SignalR: Error stopping connection", err);
        }
      };
      stopConnection();
    };
  }, [station, fetchKdsData]);
};
