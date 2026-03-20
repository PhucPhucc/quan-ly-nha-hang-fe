"use client";

import { Fragment } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UI_TEXT } from "@/lib/UI_Text";
import { OptionGroup } from "@/types/Menu";

interface OptionItemsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: OptionGroup | null;
}

export function OptionItemsModal({ open, onOpenChange, group }: OptionItemsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {group?.name || UI_TEXT.MENU.OPTIONS.VIEW_ITEMS(group?.optionItems?.length || 0)}
          </DialogTitle>
          <DialogDescription>{UI_TEXT.MENU.OPTIONS.ITEMS_HINT}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[360px] pr-2">
          <div className="space-y-3">
            {(group?.optionItems ?? []).map((item, idx) => (
              <Fragment key={item.optionItemId || idx}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    {item.extraPrice > 0 && (
                      <p className="text-sm text-primary font-semibold">
                        {UI_TEXT.COMMON.PLUS}
                        {item.extraPrice.toLocaleString(UI_TEXT.COMMON.LOCALE_VI)}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {UI_TEXT.COMMON.HASH}
                    {idx + 1}
                  </span>
                </div>
                {idx < (group?.optionItems?.length ?? 0) - 1 && <Separator />}
              </Fragment>
            ))}

            {(group?.optionItems?.length ?? 0) === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                {UI_TEXT.MENU.OPTIONS.EMPTY_COMBO}
              </p>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {UI_TEXT.BUTTON.CLOSE}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
