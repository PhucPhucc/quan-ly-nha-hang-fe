"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { Area, AreaStatus } from "@/types/Table-Layout";

interface Props {
  areas: Area[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  onManageAreas?: () => void;
}

export default function AreaTabs({ areas, selectedAreaId, onSelectArea, onManageAreas }: Props) {
  const activeAreas = areas.filter((a) => a.status === AreaStatus.ACTIVE);

  return (
    <div className="flex items-center justify-between">
      <Tabs value={selectedAreaId} onValueChange={onSelectArea}>
        <TabsList>
          {activeAreas.map((area) => (
            <TabsTrigger key={area.areaId} value={area.areaId}>
              {area.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {onManageAreas && (
        <Button variant="outline" size="sm" onClick={onManageAreas}>
          {UI_TEXT.TABLE.MANAGE_AREAS}
        </Button>
      )}
    </div>
  );
}
