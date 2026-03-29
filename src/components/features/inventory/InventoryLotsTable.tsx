"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Search } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryLotStatus } from "@/types/Inventory";

import { DisposeLotModal } from "./components/DisposeLotModal";

export function InventoryLotsTable() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("ingredientName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [_page] = useState(1);
  const { formatDate } = useBrandingFormatter();

  const { data: lotsData, isLoading } = useQuery({
    queryKey: ["inventory-lots", _page, searchTerm, statusFilter, sortBy, sortOrder],
    queryFn: () =>
      inventoryService.getInventoryLots({
        pageNumber: _page,
        pageSize: 10,
        search: searchTerm,
        status: statusFilter === "all" ? undefined : statusFilter,
        orderBy: sortBy,
        isDescending: sortOrder === "desc",
      }),
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
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={UI_TEXT.INVENTORY.LOTS.SEARCH_PLACEHOLDER}
                className="h-11 rounded-lg pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={UI_TEXT.INVENTORY.TOOLBAR.FILTER_STATUS} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{UI_TEXT.INVENTORY.TOOLBAR.STATUS_ALL}</SelectItem>
                <SelectItem value={InventoryLotStatus.Active}>
                  {UI_TEXT.INVENTORY.LOTS.STATUS_VALID}
                </SelectItem>
                <SelectItem value={InventoryLotStatus.NearExpiry}>
                  {UI_TEXT.INVENTORY.LOTS.STATUS_NEAR_EXPIRY}
                </SelectItem>
                <SelectItem value={InventoryLotStatus.Expired}>
                  {UI_TEXT.INVENTORY.LOTS.STATUS_EXPIRED}
                </SelectItem>
                <SelectItem value={InventoryLotStatus.Depleted}>
                  {UI_TEXT.INVENTORY.LOTS.STATUS_DEPLETED}
                </SelectItem>
                <SelectItem value={InventoryLotStatus.Disposed}>
                  {UI_TEXT.INVENTORY.LOTS.STATUS_DISPOSED}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder={UI_TEXT.INVENTORY.TABLE.COL_SORT} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ingredientName">{UI_TEXT.INVENTORY.TABLE.COL_NAME}</SelectItem>
                <SelectItem value="receivedAt">{UI_TEXT.INVENTORY.TABLE.COL_DATE}</SelectItem>
                <SelectItem value="expiryDate">{UI_TEXT.INVENTORY.TABLE.COL_EXPIRATION}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
              <SelectTrigger className="h-11 w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">{UI_TEXT.INVENTORY.TABLE.SORT_ASC}</SelectItem>
                <SelectItem value="desc">{UI_TEXT.INVENTORY.TABLE.SORT_DESC}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-lg border">
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
                  <TableHead className="font-bold">{UI_TEXT.INVENTORY.TABLE.COL_DATE}</TableHead>
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
                        {item.receivedAt ? (
                          <div className="text-sm text-muted-foreground">
                            {formatDate(item.receivedAt)}
                          </div>
                        ) : (
                          "---"
                        )}
                      </TableCell>
                      <TableCell>
                        {item.expiryDate ? (
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatDate(item.expiryDate)}
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
