"use client";

import { Check, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { optionService } from "@/services/optionService";
import { OptionGroup } from "@/types/Menu";

interface OptionLibraryDrawerProps {
  assignedGroupIds: string[];
  onAssign: (group: OptionGroup) => void;
}

export const OptionLibraryDrawer: React.FC<OptionLibraryDrawerProps> = ({
  assignedGroupIds,
  onAssign,
}) => {
  const [reusableGroups, setReusableGroups] = useState<OptionGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await optionService.getAllReusable(1, 100);
        if (response.isSuccess && response.data) {
          setReusableGroups(response.data.items);
        }
      } catch (error) {
        console.error("Failed to fetch reusable groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = reusableGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col p-0">
      <SheetHeader className="p-6 pb-2">
        <SheetTitle>{UI_TEXT.MENU.OPTIONS.REUSABLE_TITLE}</SheetTitle>
        <SheetDescription>{UI_TEXT.MENU.OPTIONS.LIBRARY_DESC}</SheetDescription>
      </SheetHeader>

      <div className="px-6 py-4 border-b border-border">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={UI_TEXT.MENU.OPTIONS.SEARCH_PLACEHOLDER}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            size="icon"
            variant="outline"
            className="h-9 w-9 border-primary/20 text-primary hover:bg-primary/5 shadow-sm"
            onClick={() => window.open("/menu/options", "_blank")}
            title={UI_TEXT.MENU.OPTIONS.CREATE_NEW_GROUP}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="py-4 space-y-3">
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">{UI_TEXT.COMMON.LOADING}</div>
          ) : filteredGroups.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground italic">
              {UI_TEXT.MENU.OPTIONS.EMPTY_LIBRARY}
            </div>
          ) : (
            filteredGroups.map((group) => {
              const isAssigned = assignedGroupIds.includes(group.optionGroupId);
              return (
                <div
                  key={group.optionGroupId}
                  className={cn(
                    "p-4 rounded-xl border border-border transition-all flex items-center justify-between",
                    isAssigned
                      ? "bg-muted"
                      : "hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                  )}
                  onClick={() => !isAssigned && onAssign(group)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{group.name}</span>
                      {String(group.optionType) === "1" ? (
                        <Badge
                          variant="outline"
                          className="bg-orange-50 border-orange-200 text-orange-600 uppercase text-[9px] font-bold px-1.5 py-0 h-4"
                        >
                          {UI_TEXT.MENU.OPTIONS.TYPE_SINGLE}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-indigo-50 border-indigo-200 text-indigo-600 uppercase text-[9px] font-bold px-1.5 py-0 h-4"
                        >
                          {UI_TEXT.MENU.OPTIONS.TYPE_MULTI}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {group.optionItems?.map((i) => i.label).join(", ")}
                    </p>
                    <p className="text-[10px] text-primary font-medium uppercase">
                      {UI_TEXT.MENU.OPTIONS.USAGE_COUNT(group.usageCount || 0)}
                    </p>
                  </div>
                  {isAssigned ? (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-8">
                      {UI_TEXT.BUTTON.ADD}
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </SheetContent>
  );
};
