"use client";

import { Box, Calendar, Clock, Edit2, Library } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  onCreate: () => void;
}

export const OptionGroupTable: React.FC<OptionGroupTableProps> = ({
  groups,
  loading,
  searchQuery,
  onEdit,
  onCreate,
}) => {
  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="font-bold">{UI_TEXT.MENU.OPTIONS.NAME_GROUP}</TableHead>
          <TableHead className="font-bold w-[130px]">{UI_TEXT.MENU.OPTIONS.TYPE}</TableHead>
          <TableHead className="font-bold">{UI_TEXT.MENU.OPTIONS.COMBO_ITEMS}</TableHead>
          <TableHead className="font-bold w-[110px]">{UI_TEXT.COMMON.CREATE_AT}</TableHead>
          <TableHead className="font-bold w-[110px]">{UI_TEXT.COMMON.UPDATE_AT}</TableHead>
          <TableHead className="font-bold text-center w-[120px]">
            {UI_TEXT.MENU.OPTIONS.ASSIGNED_TO_ITEMS}
          </TableHead>
          <TableHead className="font-bold text-right w-[100px]">
            {UI_TEXT.MENU.COL_ACTION}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={7} className="h-64 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-sm font-medium text-muted-foreground">
                  {UI_TEXT.COMMON.LOADING}
                  {UI_TEXT.COMMON.ELLIPSIS}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ) : groups.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-64 text-center">
              <div className="flex flex-col items-center gap-4 py-10">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                  <Library className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">
                    {searchQuery ? UI_TEXT.COMMON.NO_RESULTS : UI_TEXT.MENU.OPTIONS.EMPTY_COMBO}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? UI_TEXT.COMMON.REFINE_SEARCH
                      : UI_TEXT.MENU.OPTIONS.CREATE_FIRST_HINT}
                  </p>
                </div>
                {!searchQuery && (
                  <Button onClick={onCreate} variant="outline" size="sm">
                    {UI_TEXT.MENU.OPTIONS.CREATE_GROUP}
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          groups.map((group) => (
            <TableRow key={group.optionGroupId} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium text-foreground py-4">{group.name}</TableCell>
              <TableCell>
                {String(group.optionType) === "1" ? (
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-600 border-orange-200/50 uppercase text-[10px] font-bold px-2 py-0.5 rounded-full"
                  >
                    {UI_TEXT.MENU.OPTIONS.TYPE_SINGLE}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-600 border-indigo-200/50 uppercase text-[10px] font-bold px-2 py-0.5 rounded-full"
                  >
                    {UI_TEXT.MENU.OPTIONS.TYPE_MULTI}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5 max-w-md">
                  {group.optionItems?.map((item) => (
                    <Badge
                      key={item.optionItemId}
                      variant="secondary"
                      className="text-[10px] bg-sky-50 text-sky-700 border-sky-100/50 hover:bg-sky-100/50 transition-colors uppercase font-medium px-2 py-0.5 rounded-lg flex items-center gap-1"
                    >
                      <Box className="w-2.5 h-2.5 opacity-60" />
                      <span>{item.label}</span>
                      {item.extraPrice > 0 && (
                        <span className="opacity-70 font-bold ml-0.5">
                          {UI_TEXT.COMMON.PAREN_LEFT}
                          {UI_TEXT.COMMON.PLUS}
                          {item.extraPrice.toLocaleString(UI_TEXT.COMMON.LOCALE_VI)}
                          {UI_TEXT.COMMON.CURRENCY}
                          {UI_TEXT.COMMON.PAREN_RIGHT}
                        </span>
                      )}
                    </Badge>
                  ))}
                  {(!group.optionItems || group.optionItems.length === 0) && (
                    <span className="text-xs text-muted-foreground italic">
                      {UI_TEXT.MENU.OPTIONS.NO_ITEMS}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {group.createdAt ? (
                  <div className="text-[11px] text-muted-foreground leading-tight">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(group.createdAt).toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI)}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 opacity-70">
                      <Clock className="w-3 h-3" />
                      {new Date(group.createdAt).toLocaleTimeString(UI_TEXT.COMMON.LOCALE_VI, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground opacity-30">{UI_TEXT.COMMON.MINUS}</span>
                )}
              </TableCell>
              <TableCell>
                {group.updatedAt ? (
                  <div className="text-[11px] text-muted-foreground leading-tight">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(group.updatedAt).toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI)}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 opacity-70">
                      <Clock className="w-3 h-3" />
                      {new Date(group.updatedAt).toLocaleTimeString(UI_TEXT.COMMON.LOCALE_VI, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground opacity-30">{UI_TEXT.COMMON.MINUS}</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200/50 rounded-full h-6 min-w-[24px] flex items-center justify-center font-bold"
                >
                  {group.usageCount ?? 0}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(group)}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
