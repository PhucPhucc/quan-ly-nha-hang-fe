import Image from "next/image";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
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
          onClick={() => onItemClick(item)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onItemClick(item);
            }
          }}
          role="button"
          tabIndex={0}
          className={`
            flex flex-col justify-between aspect-3/4 bg-white border border-slate-100 shadow-sm p-3 rounded-2xl 
            hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50
            ${item.isOutOfStock ? "opacity-60 grayscale pointer-events-none" : ""}
          `}
        >
          <div className="flex-1 mb-2 rounded-xl overflow-hidden bg-slate-50 relative group">
            <Image
              src={"https://placehold.co/200x200/png?text=No+Image"}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {item.isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-black uppercase text-xs tracking-widest border border-white px-2 py-1">
                  {UI_TEXT.COMMON.OUT_OF_STOCK}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-tight mb-1">
              {item.name}
            </h3>
            <p className="font-black text-primary text-base">
              {item.price?.toLocaleString()}
              {UI_TEXT.COMMON.CURRENCY}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrderList;
