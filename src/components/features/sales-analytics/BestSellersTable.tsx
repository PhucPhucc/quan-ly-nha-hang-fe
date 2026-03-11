"use client";

import React, { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { BestSeller } from "@/types/salesAnalytics.types";

interface BestSellersTableProps {
  data: BestSeller[];
  loading?: boolean;
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <div
      className={cn(
        "w-7 h-7 flex items-center justify-center rounded-lg font-bold text-xs",
        rank === 1
          ? "bg-primary text-white"
          : rank === 2
            ? "bg-amber-50 text-amber-600"
            : rank === 3
              ? "bg-slate-50 text-slate-600"
              : "bg-muted/50 text-muted-foreground"
      )}
    >
      {rank}
    </div>
  );
}

function BestSellerRow({ item }: { item: BestSeller }) {
  return (
    <TableRow key={item.name} className="group border-muted/30">
      <TableCell>
        <RankBadge rank={item.rank} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-xl shadow-sm transition-transform group-hover:scale-105">
            <AvatarImage src={item.imageUrl} alt={item.name} />
            <AvatarFallback className="rounded-xl bg-primary/5 text-primary text-xs">
              {item.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground">{item.name}</span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant="secondary" className="font-medium bg-muted text-muted-foreground">
          {item.category}
        </Badge>
      </TableCell>
      <TableCell className="text-right font-medium">{item.quantitySold}</TableCell>
      <TableCell className="text-right font-bold text-primary">
        {item.revenue.toLocaleString()}
        {UI_TEXT.COMMON.CURRENCY}
      </TableCell>
      <TableCell className="text-right font-medium text-emerald-600 hidden lg:table-cell">
        {(item.grossProfit ?? 0).toLocaleString()}
        {UI_TEXT.COMMON.CURRENCY}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[10px] font-bold text-foreground">
            {item.percentageOfTotal}
            {UI_TEXT.COMMON.PERCENT}
          </span>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000"
              style={{ width: `${item.percentageOfTotal}${UI_TEXT.COMMON.PERCENT}` }}
            />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function BestSellersTable({ data, loading }: BestSellersTableProps) {
  const t = UI_TEXT.SALES_ANALYTICS;
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    });
  }, [data, categoryFilter]);

  // Extract unique categories for the filter
  const categories = useMemo(() => {
    const unique = new Set(data.map((item) => item.category));
    return Array.from(unique);
  }, [data]);

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-col gap-4 space-y-0 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-base font-semibold">{t.BEST_SELLERS_ANALYSIS}</CardTitle>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px] glass">
              <SelectValue placeholder={t.FILTER_CATEGORY} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{UI_TEXT.COMMON.ALL}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">{UI_TEXT.COMMON.LOADING}</div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">{UI_TEXT.COMMON.EMPTY}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-muted/50">
                <TableHead className="w-[60px] font-bold">{t.RANK}</TableHead>
                <TableHead className="font-bold">{t.ITEM_NAME}</TableHead>
                <TableHead className="hidden md:table-cell font-bold">{t.CATEGORY}</TableHead>
                <TableHead className="text-right font-bold">{t.QUANTITY}</TableHead>
                <TableHead className="text-right font-bold">{t.REVENUE}</TableHead>
                <TableHead className="text-right font-bold hidden lg:table-cell">
                  {t.GROSS_PROFIT}
                </TableHead>
                <TableHead className="w-[120px] text-right font-bold">{t.TOTAL_PERCENT}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <BestSellerRow key={item.name} item={item} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
