import React from "react";

import { KDSOrderGrid } from "@/components/features/kds/KDSOrderGrid";
import { KDSQueueHeader } from "@/components/features/kds/KDSQueueHeader";
import { OrderItemStatus, OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

// Simulated Data for KDS Layout matching the Stitch design
const MOCK_ORDERS: Order[] = [
  {
    orderId: "o1",
    orderCode: "ORD-098",
    orderType: OrderType.DineIn,
    status: OrderStatus.Serving,
    totalAmount: 0,
    isPriority: false,
    createdAt: new Date().toISOString(),
    orderItems: [
      {
        orderItemId: "oi1",
        orderId: "o1",
        menuItemId: "m1",
        itemCodeSnapshot: "M1",
        itemNameSnapshot: "Gà Nướng Mật Ong",
        stationSnapshot: "HOT",
        status: OrderItemStatus.Cooking,
        quantity: 2,
        unitPriceSnapshot: 0,
        itemNote: "Da giòn",
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        orderItemId: "oi2",
        orderId: "o1",
        menuItemId: "m2",
        itemCodeSnapshot: "M2",
        itemNameSnapshot: "Cơm Tấm Sườn Bì",
        stationSnapshot: "HOT",
        status: OrderItemStatus.Preparing,
        quantity: 1,
        unitPriceSnapshot: 0,
        itemNote: "Thêm sườn - return",
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
      {
        orderItemId: "oi3",
        orderId: "o1",
        menuItemId: "m3",
        itemCodeSnapshot: "M3",
        itemNameSnapshot: "Canh Khổ Qua",
        stationSnapshot: "HOT",
        status: OrderItemStatus.Cooking,
        quantity: 1,
        unitPriceSnapshot: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
      {
        orderItemId: "oi4",
        orderId: "o1",
        menuItemId: "m4",
        itemCodeSnapshot: "M4",
        itemNameSnapshot: "Trà Đá",
        stationSnapshot: "BAR",
        status: OrderItemStatus.Cooking,
        quantity: 3,
        unitPriceSnapshot: 0,
        itemNote: "Nhiều đá",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        orderItemId: "oi4_1",
        orderId: "o1",
        menuItemId: "m4_1",
        itemCodeSnapshot: "M4_1",
        itemNameSnapshot: "Nước Mía",
        stationSnapshot: "BAR",
        status: OrderItemStatus.Preparing,
        quantity: 2,
        unitPriceSnapshot: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      },
      {
        orderItemId: "oi4_2",
        orderId: "o1",
        menuItemId: "m4_2",
        itemCodeSnapshot: "M4_2",
        itemNameSnapshot: "Cà Phê Đen",
        stationSnapshot: "BAR",
        status: OrderItemStatus.Preparing,
        quantity: 1,
        unitPriceSnapshot: 0,
        itemNote: "Không đường",
        createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
      {
        orderItemId: "oi4_3",
        orderId: "o1",
        menuItemId: "m4_3",
        itemCodeSnapshot: "M4_3",
        itemNameSnapshot: "Bò Lúc Lắc",
        stationSnapshot: "HOT",
        status: OrderItemStatus.Preparing,
        quantity: 1,
        unitPriceSnapshot: 0,
        itemNote: "Thịt mềm",
        createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      },
      {
        orderItemId: "oi4_4",
        orderId: "o1",
        menuItemId: "m4_4",
        itemCodeSnapshot: "M4_4",
        itemNameSnapshot: "Salad Cá Hồi",
        stationSnapshot: "COLD",
        status: OrderItemStatus.Preparing,
        quantity: 1,
        unitPriceSnapshot: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
      },
      {
        orderItemId: "oi4_5",
        orderId: "o1",
        menuItemId: "m4_5",
        itemCodeSnapshot: "M4_5",
        itemNameSnapshot: "Kem Dừa",
        stationSnapshot: "COLD",
        status: OrderItemStatus.Preparing,
        quantity: 4,
        unitPriceSnapshot: 0,
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    orderId: "o2",
    orderCode: "ORD-102",
    orderType: OrderType.DineIn,
    status: OrderStatus.Serving,
    totalAmount: 0,
    isPriority: false,
    createdAt: new Date().toISOString(),
    orderItems: [
      {
        orderItemId: "oi5",
        orderId: "o2",
        menuItemId: "m5",
        itemCodeSnapshot: "M5",
        itemNameSnapshot: "Trà Chanh Giã Tay",
        stationSnapshot: "BAR",
        status: OrderItemStatus.Cooking,
        quantity: 4,
        unitPriceSnapshot: 0,
        itemNote: "Ít đá",
        createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      },
      {
        orderItemId: "oi6",
        orderId: "o2",
        menuItemId: "m6",
        itemCodeSnapshot: "M6",
        itemNameSnapshot: "Salad Ức Gà",
        stationSnapshot: "COLD",
        status: OrderItemStatus.Cooking,
        quantity: 1,
        unitPriceSnapshot: 0,
        itemNote: "nhiều rau",
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
    ],
  },
  {
    orderId: "o3",
    orderCode: "ORD-105",
    orderType: OrderType.DineIn,
    status: OrderStatus.Serving,
    totalAmount: 0,
    isPriority: false,
    createdAt: new Date().toISOString(),
    orderItems: [
      {
        orderItemId: "oi7",
        orderId: "o3",
        menuItemId: "m7",
        itemCodeSnapshot: "M7",
        itemNameSnapshot: "Bánh Mì Chảo Đặc Biệt",
        stationSnapshot: "HOT",
        status: OrderItemStatus.Cooking,
        quantity: 3,
        unitPriceSnapshot: 0,
        itemNote: "Ít pate",
        createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      },
      {
        orderItemId: "oi8",
        orderId: "o3",
        menuItemId: "m8",
        itemCodeSnapshot: "M8",
        itemNameSnapshot: "Sữa Đậu Nành",
        stationSnapshot: "BAR",
        status: OrderItemStatus.Cooking,
        quantity: 3,
        unitPriceSnapshot: 0,
        itemNote: "Ít đường",
        createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
      },
    ],
  },
  {
    orderId: "o4",
    orderCode: "ORD-108",
    orderType: OrderType.DineIn,
    status: OrderStatus.Serving,
    totalAmount: 0,
    isPriority: false,
    createdAt: new Date().toISOString(),
    orderItems: [
      {
        orderItemId: "oi9",
        orderId: "o4",
        menuItemId: "m9",
        itemCodeSnapshot: "M9",
        itemNameSnapshot: "Phở Bò Tái Lăn",
        stationSnapshot: "HOT",
        status: OrderItemStatus.Cooking,
        quantity: 2,
        unitPriceSnapshot: 0,
        itemNote: "Nhiều hành",
        createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
      },
      {
        orderItemId: "oi10",
        orderId: "o4",
        menuItemId: "m10",
        itemCodeSnapshot: "M10",
        itemNameSnapshot: "Quẩy Giòn",
        stationSnapshot: "HOT",
        status: OrderItemStatus.Cooking,
        quantity: 1,
        unitPriceSnapshot: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      },
      {
        orderItemId: "oi11",
        orderId: "o4",
        menuItemId: "m11",
        itemCodeSnapshot: "M11",
        itemNameSnapshot: "Nước Cam",
        stationSnapshot: "BAR",
        status: OrderItemStatus.Cooking,
        quantity: 1,
        unitPriceSnapshot: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
      },
    ],
  },
];

// Generate queue orders for header
const MOCK_QUEUE_ORDERS: Order[] = [
  { ...MOCK_ORDERS[2], orderCode: "105" }, // ORD-105 -> 105
  { ...MOCK_ORDERS[3], orderCode: "108" },
  { orderId: "q1", orderCode: "110" } as Order,
  { orderId: "q2", orderCode: "112" } as Order,
  { orderId: "q3", orderCode: "115" } as Order,
  { orderId: "q4", orderCode: "118" } as Order,
  { orderId: "q5", orderCode: "120" } as Order,
  { orderId: "q6", orderCode: "125" } as Order,
];

// FFE-PERF: Using Server Component for page data logic
export default async function KDSDashboardPage() {
  // Mock fetching data
  const activeOrders = MOCK_ORDERS;
  const queueOrders = MOCK_QUEUE_ORDERS;

  // Format current time for display
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  return (
    <>
      <KDSQueueHeader queueOrders={queueOrders} currentTime={timeString} />
      <KDSOrderGrid orders={activeOrders} />
    </>
  );
}
