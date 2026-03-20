"use client";

import { Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { UI_TEXT } from "@/lib/UI_Text";

import { OptionGroupInfoFields } from "./OptionGroupInfoFields";
import { OptionItemList } from "./OptionItemList";
import { OptionGroupFormModalProps } from "./types/optionGroupForm";
import { useOptionGroupForm } from "./useOptionGroupForm";

export const OptionGroupFormModal: React.FC<OptionGroupFormModalProps> = ({
  open,
  onOpenChange,
  editingGroup,
  onSuccess,
  onDelete,
}) => {
  const {
    isEditing,
    name,
    setName,
    optionType,
    setOptionType,
    isActive,
    setIsActive,
    items,
    saving,
    addItem,
    removeItem,
    updateItem,
    handleSubmit,
  } = useOptionGroupForm({ open, editingGroup, onSuccess, onOpenChange });

  const handleDelete = () => {
    if (editingGroup && onDelete) {
      onDelete(editingGroup);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle className="text-xl font-bold">
            {isEditing
              ? UI_TEXT.MENU.OPTIONS.EDIT_GROUP_TITLE
              : UI_TEXT.MENU.OPTIONS.CREATE_GROUP_TITLE}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? UI_TEXT.MENU.OPTIONS.EDIT_GROUP_DESC
              : UI_TEXT.MENU.OPTIONS.CREATE_GROUP_DESC}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-2">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {UI_TEXT.MENU.OPTIONS.SECTION_GROUP_INFO}
              </h3>
              <OptionGroupInfoFields
                name={name}
                onNameChange={setName}
                optionType={optionType}
                onTypeChange={setOptionType}
                isActive={isActive}
                onActiveChange={setIsActive}
              />
            </section>

            <Separator />

            <OptionItemList
              items={items}
              onAdd={addItem}
              onUpdate={updateItem}
              onRemove={removeItem}
            />
          </div>

          {/* Sticky footer */}
          <div className="shrink-0 px-6 py-4 border-t border-border bg-white flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {isEditing && onDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-destructive hover:bg-destructive/10 h-10 px-4"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {UI_TEXT.BUTTON.DELETE}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
                className="h-10 px-6"
              >
                {UI_TEXT.MENU.BUTTON_CANCEL}
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="h-10 px-8 shadow-lg shadow-primary/20"
              >
                {saving
                  ? UI_TEXT.COMMON.PROCESSING
                  : isEditing
                    ? UI_TEXT.MENU.BUTTON_UPDATE
                    : UI_TEXT.MENU.BUTTON_CREATE}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
