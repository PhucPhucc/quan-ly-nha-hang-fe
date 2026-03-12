"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { useTableStore } from "@/store/useTableStore";
import { AreaStatus } from "@/types/Table-Layout";

interface Props {
  onManageAreas?: () => void;
}

export default function AreaTabs({ onManageAreas }: Props) {
  const { areas, selectedAreaId, setSelectedAreaId } = useTableStore();
  const activeAreas = areas.filter((a) => a.status === AreaStatus.Active);

  return (
    <div className="flex items-center justify-between">
      <Tabs value={selectedAreaId} onValueChange={setSelectedAreaId}>
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
