import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";

import { ReservationDto, reservationService } from "@/services/reservationService";

const NUMBERSTARTPAGE = 1;
const ITEMS_PER_PAGE = 8;

export const useReservationBoard = () => {
  const [data, setData] = useState<ReservationDto[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    booked: 0,
    checkedIn: 0,
    cancelled: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    dateStr: format(new Date(), "yyyy-MM-dd"),
    area: "all",
    status: "all",
    currentPage: NUMBERSTARTPAGE,
  });

  const fetchReservations = useCallback(async () => {
    try {
      const res = await reservationService.getReservations({
        pageNumber: filters.currentPage,
        pageSize: ITEMS_PER_PAGE,
        search: filters.search,
        date: filters.dateStr,
        areaId: filters.area === "all" ? undefined : filters.area,
        status: filters.status === "all" ? undefined : filters.status,
      });
      if (res.isSuccess) {
        setData(res.data.items);
        setTotalItems(res.data.totalCount);
      }
    } catch (err) {
      console.error(err);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      // Fetch a larger page size to get all reservations for the day locally
      const res = await reservationService.getReservations({
        pageNumber: 1,
        pageSize: 1000,
        date: filters.dateStr,
      });

      if (res.isSuccess) {
        const items = res.data.items;
        setStats({
          total: res.data.totalCount,
          booked: items.filter((i) => i.status.toLowerCase() === "booked").length,
          checkedIn: items.filter((i) => i.status.toLowerCase() === "checked_in").length,
          cancelled: items.filter((i) => i.status.toLowerCase() === "cancelled").length,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [filters.dateStr]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchReservations(), fetchStats()]);
    };
    fetchData();
  }, [fetchReservations, fetchStats]);

  const handleRefresh = useCallback(() => {
    fetchReservations();
    fetchStats();
  }, [fetchReservations, fetchStats]);

  const setFilter = useCallback((key: keyof typeof filters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Whenever a filter other than currentPage changes, reset it to page 1
      currentPage: key === "currentPage" ? (value as number) : NUMBERSTARTPAGE,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      dateStr: format(new Date(), "yyyy-MM-dd"),
      area: "all",
      status: "all",
      currentPage: NUMBERSTARTPAGE,
    });
  }, []);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || NUMBERSTARTPAGE;

  return {
    data,
    totalItems,
    totalPages,
    stats,
    filters,
    setFilter,
    resetFilters,
    handleRefresh,
  };
};
