"use client";

import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UI_TEXT } from "@/lib/UI_Text";

import { Table } from "../TableItem";
import CardFeature from "./CardFeature";

export enum Feature {
  MERGE = "MERGE",
  SPLIT = "SPLIT",
  MOVE_TABLE = "MOVE_TABLE",
  CANCEL = "CANCEL",
}

const DropdownFeature = ({ table }: { table: Table }) => {
  const [feature, setFeature] = useState<Feature | null>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="p-0.5 rounded-full hover:bg-table-serving/25"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={6} align="start">
          {/* <DropdownMenuLabel>{UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.LABEL_MERGE}</DropdownMenuLabel> */}
          <DropdownMenuItem onClick={() => setFeature(Feature.MERGE)}>
            {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MERGE}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFeature(Feature.SPLIT)}>
            {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFeature(Feature.MOVE_TABLE)}>
            {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MOVE_TABLE}
          </DropdownMenuItem>
          {(!table.price || table.price === "0" || parseFloat(table.price) === 0) && (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setFeature(Feature.CANCEL)}
            >
              {UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.CANCEL}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={!!feature} onOpenChange={() => setFeature(null)}>
        <DialogContent className={feature === Feature.SPLIT ? "sm:max-w-2xl" : undefined}>
          <DialogTitle>
            {feature === Feature.MERGE
              ? UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MERGE
              : feature === Feature.SPLIT
                ? UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.SPLIT
                : feature === Feature.MOVE_TABLE
                  ? UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.MOVE_TABLE
                  : UI_TEXT.ORDER.BOARD.DROPDOWN_FEATURE.CANCEL}
          </DialogTitle>
          {feature && <CardFeature feature={feature} table={table} onClose={setFeature} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DropdownFeature;
