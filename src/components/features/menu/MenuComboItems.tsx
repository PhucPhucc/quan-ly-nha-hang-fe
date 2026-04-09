import { Check, Plus, Search, Trash2 } from "lucide-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MenuFormType } from "@/hooks/useMenuForm";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types/Menu";

interface MenuComboItemsProps {
  form: MenuFormType;
}

interface ComboItemSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  menuItems: MenuItem[];
  isInvalid: boolean;
  fieldPath: string;
}

const ComboItemSearchField: React.FC<ComboItemSearchFieldProps> = ({
  value,
  onChange,
  menuItems,
  isInvalid,
  fieldPath,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedItem = useMemo(
    () => menuItems.find((item) => item.menuItemId === value),
    [menuItems, value]
  );

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return menuItems;
    const lower = searchTerm.toLowerCase();
    return menuItems.filter((item) => item.name.toLowerCase().includes(lower));
  }, [menuItems, searchTerm]);

  const scrollHighlightedIntoView = useCallback((index: number) => {
    const container = listRef.current;
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>("[data-combo-option]");
    items[index]?.scrollIntoView({ block: "nearest" });
  }, []);

  const handleSelect = useCallback(
    (menuItemId: string) => {
      onChange(menuItemId);
      setOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
    },
    [onChange]
  );

  const handleInputFocus = useCallback(() => {
    setOpen(true);
    setSearchTerm("");
    setHighlightedIndex(-1);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setOpen(true);
    setHighlightedIndex(-1);
  }, []);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open) return;

      const itemCount = filteredItems.length;
      if (itemCount === 0) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex = highlightedIndex < itemCount - 1 ? highlightedIndex + 1 : 0;
          setHighlightedIndex(nextIndex);
          scrollHighlightedIntoView(nextIndex);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : itemCount - 1;
          setHighlightedIndex(prevIndex);
          scrollHighlightedIntoView(prevIndex);
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < itemCount) {
            handleSelect(filteredItems[highlightedIndex].menuItemId);
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          setOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
        }
      }
    },
    [open, filteredItems, highlightedIndex, handleSelect, scrollHighlightedIntoView]
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor asChild>
        <div className="relative min-w-0">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
          <Input
            ref={inputRef}
            data-field-path={fieldPath}
            aria-invalid={isInvalid}
            placeholder={selectedItem ? selectedItem.name : UI_TEXT.MENU.COMBO_SEARCH_PLACEHOLDER}
            value={open ? searchTerm : (selectedItem?.name ?? "")}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className={cn(
              "pl-8 min-w-0 truncate",
              selectedItem && !open && "text-foreground",
              !selectedItem && !open && "text-muted-foreground"
            )}
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-activedescendant={
              highlightedIndex >= 0 ? `combo-option-${fieldPath}-${highlightedIndex}` : undefined
            }
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="p-0"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <ScrollArea className="max-h-56">
          {filteredItems.length === 0 ? (
            <div className="text-muted-foreground px-3 py-4 text-center text-sm">
              {UI_TEXT.COMMON.NO_RESULTS}
            </div>
          ) : (
            <div ref={listRef} className="p-1" role="listbox">
              {filteredItems.map((menuItem, index) => {
                const isSelected = menuItem.menuItemId === value;
                const isHighlighted = index === highlightedIndex;
                return (
                  <button
                    key={menuItem.menuItemId}
                    id={`combo-option-${fieldPath}-${index}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-combo-option
                    className={cn(
                      "hover:bg-accent flex min-w-0 w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                      isSelected && "font-medium",
                      isHighlighted && "bg-accent",
                      isSelected && !isHighlighted && "bg-accent/50"
                    )}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(menuItem.menuItemId)}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isSelected ? "text-primary opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{menuItem.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export const MenuComboItems: React.FC<MenuComboItemsProps> = ({ form }) => {
  const { control, formState, register } = form.formMethods;

  return (
    <Field className="space-y-2 col-span-2">
      <div className="flex justify-between items-center mb-2">
        <FieldLabel>{UI_TEXT.MENU.LABEL_COMBO_ITEMS}</FieldLabel>
        <Button type="button" variant="outline" size="sm" onClick={form.appendComboItem}>
          <Plus className="h-4 w-4" /> {UI_TEXT.MENU.ADD_COMBO}
        </Button>
      </div>

      {form.isFetchingCombo && (
        <div className="text-sm text-muted-foreground">{UI_TEXT.COMMON.LOADING}</div>
      )}

      {!form.isFetchingCombo && form.comboItemsFields.length === 0 && (
        <div className="text-sm text-muted-foreground">{UI_TEXT.MENU.EMPTY_COMBO}</div>
      )}

      <FieldContent className="space-y-2">
        {form.comboItemsFields.map((item, index) => (
          <div key={item.fieldId} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <Controller
                control={control}
                name={`comboItems.${index}.menuItemId`}
                render={({ field }) => (
                  <ComboItemSearchField
                    value={field.value}
                    onChange={field.onChange}
                    menuItems={form.menuItems}
                    isInvalid={!!formState.errors.comboItems?.[index]?.menuItemId}
                    fieldPath={`comboItems.${index}.menuItemId`}
                  />
                )}
              />
              <FieldError errors={[formState.errors.comboItems?.[index]?.menuItemId]} />
            </div>

            <div className="w-24 space-y-1">
              <Input
                type="number"
                min="1"
                data-field-path={`comboItems.${index}.quantity`}
                aria-invalid={!!formState.errors.comboItems?.[index]?.quantity}
                {...register(`comboItems.${index}.quantity`)}
              />
              <FieldError errors={[formState.errors.comboItems?.[index]?.quantity]} />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => form.removeComboItem(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}

        <FieldError errors={[formState.errors.comboItems as { message?: string } | undefined]} />
      </FieldContent>
    </Field>
  );
};
