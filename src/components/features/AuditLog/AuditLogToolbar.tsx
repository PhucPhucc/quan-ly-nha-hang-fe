"use client";

import { endOfDay, startOfDay } from "date-fns";
import { RefreshCcw, Search } from "lucide-react";
import React from "react";

import {
  INVENTORY_INPUT_CLASS,
  INVENTORY_SELECT_TRIGGER_CLASS,
} from "@/components/features/inventory/components/inventoryStyles";
import { InventoryToolbar } from "@/components/features/inventory/components/InventoryToolbar";
import { DatePicker } from "@/components/shared/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrandingFormatter } from "@/lib/branding-formatting";
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
  const { formatDate } = useBrandingFormatter();

  return (
    <InventoryToolbar
      actions={
        <Button
          variant="ghost"
          type="button"
          size="icon"
          onClick={resetFilters}
          className="rounded-full hover:bg-card-foreground/10"
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
        <SelectTrigger className={cn(INVENTORY_SELECT_TRIGGER_CLASS, " w-full sm:w-44")}>
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
        <SelectTrigger className={cn(INVENTORY_SELECT_TRIGGER_CLASS, " w-full sm:w-44")}>
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

      <div className="flex">
        <DatePicker
          placeholder={formatDate(new Date())}
          value={draftFilters.fromDate}
          onChange={(event: Date | undefined) => {
            applyFilters({ ...draftFilters, fromDate: event ? startOfDay(event) : event });
          }}
        />
      </div>

      <DatePicker
        placeholder={formatDate(new Date())}
        value={draftFilters.toDate}
        onChange={(event: Date | undefined) => {
          applyFilters({ ...draftFilters, toDate: event ? endOfDay(event) : event });
        }}
      />
    </InventoryToolbar>
  );
}
