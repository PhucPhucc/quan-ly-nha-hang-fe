"use client";

import { CalendarIcon, RefreshCcw, Search } from "lucide-react";
import React from "react";

import {
  INVENTORY_ICON_BUTTON_CLASS,
  INVENTORY_INPUT_CLASS,
  INVENTORY_SELECT_TRIGGER_CLASS,
} from "@/components/features/inventory/components/inventoryStyles";
import { InventoryToolbar } from "@/components/features/inventory/components/InventoryToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

import { AuditLogFilterState } from "./types";

interface AuditLogToolbarProps {
  draftFilters: AuditLogFilterState;
  applyFilters: (next: AuditLogFilterState) => void;
  resetFilters: () => void;
  entityOptions: { value: string; label: string }[];
  actionOptions: { value: string; label: string }[];
}

export function AuditLogToolbar({
  draftFilters,
  applyFilters,
  resetFilters,
  entityOptions,
  actionOptions,
}: AuditLogToolbarProps) {
  return (
    <InventoryToolbar
      actions={
        <Button
          variant="outline"
          type="button"
          className={INVENTORY_ICON_BUTTON_CLASS}
          onClick={resetFilters}
          title={UI_TEXT.AUDIT_LOG.FILTER.RESET}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      }
    >
      <Select
        value={draftFilters.entityNameFilter}
        onValueChange={(value) => {
          applyFilters({ ...draftFilters, entityNameFilter: value });
        }}
      >
        <SelectTrigger
          className={cn(INVENTORY_SELECT_TRIGGER_CLASS, "min-h-[40px] w-full sm:w-44")}
        >
          <SelectValue placeholder={UI_TEXT.AUDIT_LOG.ENTITIES.ALL} />
        </SelectTrigger>
        <SelectContent>
          {entityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={draftFilters.actionFilter}
        onValueChange={(value) => {
          applyFilters({ ...draftFilters, actionFilter: value });
        }}
      >
        <SelectTrigger
          className={cn(INVENTORY_SELECT_TRIGGER_CLASS, "min-h-[40px] w-full sm:w-44")}
        >
          <SelectValue placeholder={UI_TEXT.AUDIT_LOG.ACTIONS_LIST.ALL} />
        </SelectTrigger>
        <SelectContent>
          {actionOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          className={cn(INVENTORY_INPUT_CLASS, "pl-9")}
          value={draftFilters.entityIdFilter}
          onChange={(event) => {
            applyFilters({ ...draftFilters, entityIdFilter: event.target.value });
          }}
          placeholder={UI_TEXT.AUDIT_LOG.ENTITY_ID}
        />
      </div>

      <div className="relative min-w-[180px]">
        <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="date"
          className={cn(INVENTORY_INPUT_CLASS, "pl-10")}
          value={draftFilters.fromDate}
          onChange={(event) => {
            applyFilters({ ...draftFilters, fromDate: event.target.value });
          }}
        />
      </div>

      <div className="relative min-w-[180px]">
        <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="date"
          className={cn(INVENTORY_INPUT_CLASS, "pl-10")}
          value={draftFilters.toDate}
          onChange={(event) => {
            applyFilters({ ...draftFilters, toDate: event.target.value });
          }}
        />
      </div>
    </InventoryToolbar>
  );
}
