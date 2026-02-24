"use client";

import React from "react";

import { MenuItem } from "@/types/Menu";

const OrderList = ({
  menuList,
  onItemClick,
}: {
  menuList: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}) => {
  return (
    <ul className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
      {menuList.map((item) => (
        <li
          key={item.code}
          className={`
            flex flex-col justify-between aspect-3/4 bg-white border border-slate-100 shadow-sm p-3 rounded-2xl 
            hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer
            ${item.isOutOfStock ? "opacity-60 grayscale pointer-events-none" : ""}
          `}
          onClick={() => onItemClick(item)}
        >
          <div className="flex-1 mb-2 rounded-xl overflow-hidden bg-slate-50 relative group">
            <img
              src={item.imageUrl || "https://placehold.co/200x200?text=No+Image"}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {item.isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-black uppercase text-xs tracking-widest border border-white px-2 py-1">
                  Hết hàng
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-tight mb-1">
              {item.name}
            </h3>
            <p className="font-black text-primary text-base">
              {item.priceDineIn.toLocaleString()}đ
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrderList;
