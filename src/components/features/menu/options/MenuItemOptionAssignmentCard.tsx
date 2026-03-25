import { ArrowDown, ArrowUp, CheckCircle2, ListChecks, Trash2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";
import { MenuItemOptionGroup, OptionGroup } from "@/types/Menu";

interface MenuItemOptionAssignmentCardProps {
  assignment: MenuItemOptionGroup;
  idx: number;
  totalItems: number;
  draggingAssignmentId: string | null;
  handleDragStart: (id: string) => void;
  handleDragEnd: () => void;
  handleDrop: (id: string) => void;
  handleReorder: (idx: number, direction: "up" | "down") => void;
  handleOpenItems: (group: OptionGroup | null) => void;
  handleUpdateAssignment: (id: string, updates: Partial<MenuItemOptionGroup>) => void;
  handleUnassign: (id: string) => void;
}

export const MenuItemOptionAssignmentCard: React.FC<MenuItemOptionAssignmentCardProps> = ({
  assignment,
  idx,
  totalItems,
  draggingAssignmentId,
  handleDragStart,
  handleDragEnd,
  handleDrop,
  handleReorder,
  handleOpenItems,
  handleUpdateAssignment,
  handleUnassign,
}) => {
  return (
    <Card
      key={assignment.menuItemOptionGroupId}
      className={`overflow-hidden border-border shadow-sm transition-all ${
        draggingAssignmentId === assignment.menuItemOptionGroupId
          ? "opacity-60 ring-2 ring-primary/30 shadow-lg scale-[0.99]"
          : "hover:shadow-md cursor-grab active:cursor-grabbing"
      }`}
      draggable
      onDragStart={() => handleDragStart(assignment.menuItemOptionGroupId)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => handleDrop(assignment.menuItemOptionGroupId)}
    >
      <div className="flex items-center p-4 gap-4">
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={idx === 0}
            onClick={() => handleReorder(idx, "up")}
            title="Đưa lên trên"
          >
            <ArrowUp className="h-4 w-4 text-muted-foreground/70" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={idx === totalItems - 1}
            onClick={() => handleReorder(idx, "down")}
            title="Đưa xuống dưới"
          >
            <ArrowDown className="h-4 w-4 text-muted-foreground/70" />
          </Button>
        </div>

        {/* Group Identity */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{assignment.optionGroup?.name}</span>
            {String(assignment.optionGroup?.optionType) === "1" ? (
              <Badge
                variant="outline"
                className="bg-orange-50 border-orange-200 text-orange-600 uppercase text-[9px] font-bold px-1.5 py-0 gap-1 shadow-sm h-5"
              >
                <CheckCircle2 className="w-3 h-3" />
                {UI_TEXT.MENU.OPTIONS.TYPE_SINGLE}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-indigo-50 border-indigo-200 text-indigo-600 uppercase text-[9px] font-bold px-1.5 py-0 gap-1 shadow-sm h-5"
              >
                <ListChecks className="w-3 h-3" />
                {UI_TEXT.MENU.OPTIONS.TYPE_MULTI}
              </Badge>
            )}
          </div>
          <button
            type="button"
            className="text-[11px] text-primary hover:underline font-medium"
            onClick={() => handleOpenItems(assignment.optionGroup ?? null)}
          >
            {UI_TEXT.MENU.OPTIONS.VIEW_ITEMS(assignment.optionGroup?.optionItems?.length || 0)}
          </button>
        </div>

        {/* Inline Configuration */}
        <div className="flex items-center gap-4 border-l pl-4 border-border/50">
          <div className="flex flex-col items-center gap-1">
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {UI_TEXT.MENU.OPTIONS.REQUIRED_LABEL}
            </Label>
            <Switch
              className="h-5 w-9 scale-90"
              checked={assignment.isRequired}
              onCheckedChange={(val) =>
                handleUpdateAssignment(assignment.menuItemOptionGroupId, {
                  isRequired: val,
                })
              }
            />
          </div>

          <div className="flex flex-col items-center gap-1">
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {UI_TEXT.MENU.OPTIONS.MIN_SELECT}
            </Label>
            <Input
              type="number"
              className="h-7 w-12 text-center text-xs p-1"
              value={assignment.minSelect}
              onChange={(e) =>
                handleUpdateAssignment(assignment.menuItemOptionGroupId, {
                  minSelect: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="flex flex-col items-center gap-1">
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {UI_TEXT.MENU.OPTIONS.MAX_SELECT}
            </Label>
            <Input
              type="number"
              className="h-7 w-12 text-center text-xs p-1"
              value={assignment.maxSelect}
              onChange={(e) =>
                handleUpdateAssignment(assignment.menuItemOptionGroupId, {
                  maxSelect: Number(e.target.value),
                })
              }
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 ml-2"
            onClick={() => handleUnassign(assignment.menuItemOptionGroupId)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
