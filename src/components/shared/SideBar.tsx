"use client";

import { ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import clsx from "clsx";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={clsx(
        "w-64 h-screen flex-col bg-sidebar border-r border-sidebar-border -translate-x-48 transition duration-400",
        { "translate-x-0": isOpen },
      )}
    >
      <div className='flex items-center justify-end mt-4 px-3'>
        {isOpen && (
          <div className='flex-1 text-center flex items-center justify-center gap-3 '>
            <UtensilsCrossed />
            <p className='text-3xl font-semibold font-serif'>FoodHub</p>
          </div>
        )}
        <Button
          variant='ghost'
          size='icon'
          className=' hover:bg-sidebar-accent transition duration-300'
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <ChevronRight
            className={clsx("size-5 transition duration-300", {
              " rotate-180": isOpen,
            })}
          />
        </Button>
      </div>
    </nav>
  );
};

export default SideBar;
