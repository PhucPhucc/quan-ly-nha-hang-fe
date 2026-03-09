"use client";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

type Props = { onNewItem: () => void; onNewSet: () => void };

export default function TopBar({ onNewItem, onNewSet }: Props) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-bold">{UI_TEXT.MENU.PAGE_TITLE}</h2>
        <p className="text-muted-foreground mt-2">{UI_TEXT.MENU.PAGE_SUBTITLE}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onNewSet}>
          <PlusCircle className="mr-2 h-4 w-4" /> {UI_TEXT.MENU.ADD_COMBO}
        </Button>
        <Button onClick={onNewItem}>
          <PlusCircle className="mr-2 h-4 w-4" /> {UI_TEXT.MENU.ADD_ITEM}
        </Button>
      </div>
    </div>
  );
}
