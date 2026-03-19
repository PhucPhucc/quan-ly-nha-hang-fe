"use client";

import { Plus, Search } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";

interface OptionGroupFiltersProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  typeFilter: string;
  onTypeChange: (v: string) => void;
  onCreate: () => void;
}

export const OptionGroupFilters: React.FC<OptionGroupFiltersProps> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  onCreate,
}) => (
  <Card className="p-4 border-border shadow-soft bg-card/50">
    <div className="flex gap-4 items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={UI_TEXT.MENU.OPTIONS.SEARCH_PLACEHOLDER}
          className="pl-9 h-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Type filter */}
      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className="w-40 h-10">
          <SelectValue placeholder={UI_TEXT.MENU.OPTIONS.TYPE} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{UI_TEXT.MENU.OPTIONS.FILTER_ALL_TYPES}</SelectItem>
          <SelectItem value="1">{UI_TEXT.MENU.OPTIONS.TYPE_SINGLE}</SelectItem>
          <SelectItem value="2">{UI_TEXT.MENU.OPTIONS.TYPE_MULTI}</SelectItem>
        </SelectContent>
      </Select>

      {/* Create button */}
      <Button size="default" className="shrink-0 shadow-lg shadow-primary/20" onClick={onCreate}>
        <Plus className="h-4 w-4 mr-2" />
        {UI_TEXT.MENU.OPTIONS.CREATE_NEW_GROUP}
      </Button>
    </div>
  </Card>
);
