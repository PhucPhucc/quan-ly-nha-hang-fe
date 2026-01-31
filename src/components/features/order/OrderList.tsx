"use client";

import React from "react";
import { toast } from "sonner";

import { useOrderStore } from "@/store/useOrderStore";
import { MenuItem } from "@/types/Menu";

const OrderList = ({ menuList }: { menuList: MenuItem[] }) => {
  const addOrder = useOrderStore((state) => state.addItem);

  return (
    <ul className="grid grid-cols-5 gap-2">
      {menuList.map((item) => (
        <li
          key={item.code}
          className="aspect-square bg-card border shadow-md py-2 px-4 rounded-md hover:ring-2 hover:ring-ring hover:shadow-2xl transition duration-300"
          onClick={() => {
            toast.success("Them thanh cong");
            addOrder(item, 1);
          }}
        >
          <p className="text-lg font-semibold">{item.name}</p>
          <p>{item.dine_in_price} VND</p>
        </li>
      ))}
    </ul>
  );
};

export default OrderList;
