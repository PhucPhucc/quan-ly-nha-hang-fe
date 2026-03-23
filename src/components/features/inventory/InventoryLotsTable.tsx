"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Search } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryLotStatus } from "@/types/Inventory";

import { DisposeLotModal } from "./components/DisposeLotModal";

export function InventoryLotsTable() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [_page] = useState(1);

  const { data: lotsData, isLoading } = useQuery({
    queryKey: ["inventory-lots", _page, searchTerm],
    queryFn: () =>
      inventoryService.getInventoryLots({ pageNumber: _page, pageSize: 10, search: searchTerm }),
  });

  const getStatusBadge = (status: InventoryLotStatus) => {
    switch (status) {
      case InventoryLotStatus.Active:
        return (
          <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
            {UI_TEXT.INVENTORY.LOTS.STATUS_VALID}
          </Badge>
        );
      case InventoryLotStatus.NearExpiry:
        return (
          <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
            {UI_TEXT.INVENTORY.LOTS.STATUS_NEAR_EXPIRY}
          </Badge>
        );
      case InventoryLotStatus.Expired:
        return (
          <Badge variant="outline" className="border-danger/20 bg-danger/10 text-danger">
            {UI_TEXT.INVENTORY.LOTS.STATUS_EXPIRED}
          </Badge>
        );
      case InventoryLotStatus.Depleted:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            {UI_TEXT.INVENTORY.LOTS.STATUS_DEPLETED}
          </Badge>
        );
      case InventoryLotStatus.Disposed:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            {UI_TEXT.INVENTORY.LOTS.STATUS_DISPOSED}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none bg-background/50 shadow-sm backdrop-blur-sm">
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={UI_TEXT.INVENTORY.LOTS.SEARCH_PLACEHOLDER}
                className="h-11 rounded-xl pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">{UI_TEXT.INVENTORY.LOTS.COL_CODE}</TableHead>
                  <TableHead className="font-bold">
                    {UI_TEXT.INVENTORY.LOTS.COL_INGREDIENT}
                  </TableHead>
                  <TableHead className="text-right font-bold">
                    {UI_TEXT.INVENTORY.LOTS.COL_STOCK}
                  </TableHead>
                  <TableHead className="font-bold">{UI_TEXT.INVENTORY.LOTS.COL_UNIT}</TableHead>
                  <TableHead className="font-bold">{UI_TEXT.INVENTORY.LOTS.COL_EXPIRY}</TableHead>
                  <TableHead className="font-bold">{UI_TEXT.INVENTORY.LOTS.COL_STATUS}</TableHead>
                  <TableHead className="text-center font-bold">
                    {UI_TEXT.INVENTORY.LOTS.COL_ACTIONS}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-sm font-medium text-muted-foreground"
                    >
                      {UI_TEXT.COMMON.LOADING}
                    </TableCell>
                  </TableRow>
                ) : !lotsData?.data?.items?.length ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-sm font-medium text-muted-foreground"
                    >
                      {UI_TEXT.INVENTORY.TABLE.EMPTY_TITLE}
                    </TableCell>
                  </TableRow>
                ) : (
                  lotsData.data.items.map((item) => (
                    <TableRow
                      key={item.inventoryLotId}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="font-mono text-xs font-semibold">
                        {item.lotCode}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.ingredientName}</div>
                        <div className="text-xs text-muted-foreground">{item.ingredientCode}</div>
                      </TableCell>
                      <TableCell className="text-right font-bold tabular-nums text-primary">
                        {item.remainingQuantity}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.unit}</TableCell>
                      <TableCell>
                        {item.expiryDate ? (
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(new Date(item.expiryDate), "dd/MM/yyyy", { locale: vi })}
                          </div>
                        ) : (
                          "---"
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-center">
                        {item.status !== InventoryLotStatus.Disposed &&
                          item.status !== InventoryLotStatus.Depleted &&
                          item.remainingQuantity > 0 && (
                            <DisposeLotModal
                              item={item}
                              onSuccess={() =>
                                queryClient.invalidateQueries({ queryKey: ["inventory-lots"] })
                              }
                            />
                          )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
