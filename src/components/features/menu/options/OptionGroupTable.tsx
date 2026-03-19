"use client";

import { Edit, MoreVertical, Plus, Trash2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { OptionGroup } from "@/types/Menu";

interface OptionGroupTableProps {
  groups: OptionGroup[];
  loading: boolean;
  searchQuery: string;
  onEdit: (group: OptionGroup) => void;
  onDelete: (group: OptionGroup) => void;
  onCreate: () => void;
}

const typeBadgeLabel = (type: OptionGroup["optionType"]) =>
  String(type) === "1" ? UI_TEXT.MENU.OPTIONS.TYPE_SINGLE : UI_TEXT.MENU.OPTIONS.TYPE_MULTI;

export const OptionGroupTable: React.FC<OptionGroupTableProps> = ({
  groups,
  loading,
  searchQuery,
  onEdit,
  onDelete,
  onCreate,
}) => (
  <Card className="border-border shadow-soft overflow-hidden rounded-xl bg-card p-0">
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="font-bold">{UI_TEXT.MENU.OPTIONS.NAME_GROUP}</TableHead>
          <TableHead className="font-bold">{UI_TEXT.MENU.OPTIONS.TYPE}</TableHead>
          <TableHead className="font-bold">{UI_TEXT.MENU.OPTIONS.COMBO_ITEMS}</TableHead>
          <TableHead className="font-bold text-center">
            {UI_TEXT.MENU.OPTIONS.ASSIGNED_TO_ITEMS}
          </TableHead>
          <TableHead className="font-bold text-right">{UI_TEXT.MENU.COL_ACTION}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="h-48 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">{UI_TEXT.COMMON.LOADING}</span>
              </div>
            </TableCell>
          </TableRow>
        ) : groups.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-48 text-center">
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground italic">
                  {searchQuery
                    ? UI_TEXT.MENU.OPTIONS.EMPTY_LIBRARY
                    : UI_TEXT.MENU.OPTIONS.EMPTY_MASTER}
                </p>
                {!searchQuery && (
                  <Button variant="outline" size="sm" onClick={onCreate}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    {UI_TEXT.MENU.OPTIONS.CREATE_NEW_GROUP}
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          groups.map((group) => (
            <TableRow key={group.optionGroupId} className="hover:bg-muted/30 transition-colors">
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-foreground">{group.name}</span>
                  {!group.isActive && (
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {UI_TEXT.MENU.OPTIONS.STATUS_HIDDEN}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="bg-primary/5 border-primary/20 text-primary uppercase text-[10px]"
                >
                  {typeBadgeLabel(group.optionType)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[360px]">
                <div className="flex flex-wrap gap-1">
                  {group.optionItems?.map((item) => (
                    <span
                      key={item.optionItemId}
                      className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {item.label}
                      {item.extraPrice > 0 && (
                        <span className="ml-1 text-primary font-medium">
                          {UI_TEXT.COMMON.PLUS}
                          {item.extraPrice.toLocaleString(UI_TEXT.COMMON.LOCALE_VI)}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={(group.usageCount ?? 0) > 0 ? "default" : "secondary"}
                  className="font-bold tabular-nums"
                >
                  {group.usageCount ?? 0}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                    onClick={() => onEdit(group)}
                    title={UI_TEXT.MENU.TOOLTIP_EDIT}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => onDelete(group)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {UI_TEXT.BUTTON.DELETE}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </Card>
);
