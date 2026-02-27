import { UI_TEXT } from "@/lib/UI_Text";

import { Table } from "./TableItem";

export const mockTables: Table[] = [
  { tableNumber: 1, status: "READY", label: UI_TEXT.TABLE.READY, people: 2 },
  {
    tableNumber: 2,
    status: "INPROCESS",
    label: UI_TEXT.TABLE.INPROCESS,
    people: 4,
    elapsedTime: "45m",
    price: "250.000đ",
  },
  { tableNumber: 3, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 4 },
  { tableNumber: 4, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  {
    tableNumber: 5,
    status: "INPROCESS",
    label: UI_TEXT.TABLE.INPROCESS,
    people: 3,
    elapsedTime: "15m",
    price: "120.000đ",
  },
  { tableNumber: 6, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 7, status: "READY", label: UI_TEXT.TABLE.READY, people: 6 },
  {
    tableNumber: 8,
    status: "INPROCESS",
    label: UI_TEXT.TABLE.INPROCESS,
    people: 4,
    elapsedTime: "1h 10m",
    price: "450.000đ",
  },
  {
    tableNumber: 9,
    status: "INPROCESS",
    label: UI_TEXT.TABLE.INPROCESS,
    people: 2,
    elapsedTime: "30m",
    price: "180.000đ",
  },
  { tableNumber: 10, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 11, status: "RESERVED", label: UI_TEXT.TABLE.RESERVED, people: 4 },
  { tableNumber: 12, status: "READY", label: UI_TEXT.TABLE.READY, people: 2 },
  {
    tableNumber: 13,
    status: "INPROCESS",
    label: UI_TEXT.TABLE.INPROCESS,
    people: 5,
    elapsedTime: "2h",
    price: "1.250.000đ",
  },
  { tableNumber: 14, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 4 },
  { tableNumber: 15, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 16, status: "READY", label: UI_TEXT.TABLE.READY, people: 2 },
  { tableNumber: 17, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 18, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 19, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 20, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
];

import { TakeawayOrder } from "./TakeawayItem";

export const mockTakeawayOrders: TakeawayOrder[] = [
  {
    id: "TK001",
    orderCode: "ORD-20240523-001",
    status: "INPROCESS",
    label: "Mang đi #001",
    people: 1,
    elapsedTime: "10m",
    price: "85.000đ",
  },
  {
    id: "TK002",
    orderCode: "ORD-20240523-002",
    status: "READY",
    label: "Mang đi #002",
    people: 1,
    elapsedTime: "5m",
    price: "150.000đ",
  },
  {
    id: "TK003",
    orderCode: "ORD-20240523-003",
    status: "INPROCESS",
    label: "Mang đi #003",
    people: 2,
    elapsedTime: "25m",
    price: "320.000đ",
  },
];
