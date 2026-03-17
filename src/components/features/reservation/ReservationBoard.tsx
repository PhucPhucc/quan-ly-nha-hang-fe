"use client";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";

import { ReservationDto, reservationService } from "@/services/reservationService";

import { ReservationFilter } from "./ReservationFilter";
import { ReservationStatus } from "./ReservationStatus";
import { ReservationTable } from "./ReservationTable";

const NUMBERSTARTPAGE = 1;

const TableBookingBoard = () => {
  const [data, setData] = useState<ReservationDto[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Stats state
  const [statsTotal, setStatsTotal] = useState(0);
  const [statsBooked, setStatsBooked] = useState(0);
  const [statsCheckedIn, setStatsCheckedIn] = useState(0);
  const [statsCancelled, setStatsCancelled] = useState(0);

  // Filter States
  const [search, setSearch] = useState("");
  const [dateStr, setDateStr] = useState(format(new Date(), "yyyy-MM-dd"));
  const [area, setArea] = useState("all");
  const [status, setStatus] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(NUMBERSTARTPAGE);
  const itemsPerPage = 8;

  const fetchReservations = useCallback(async () => {
    try {
      const res = await reservationService.getReservations({
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        search,
        date: dateStr,
        areaId: area === "all" ? undefined : area,
        status: status === "all" ? undefined : status,
      });
      if (res.isSuccess) {
        setData(res.data.items);
        setTotalItems(res.data.totalCount);
      }
    } catch (err) {
      console.error(err);
    }
  }, [currentPage, search, dateStr, area, status]);

  const fetchStats = useCallback(async () => {
    try {
      // Fetch total for current date filter (no status filter, large page size)
      const [resAll, resBooked, resCheckedIn, resCancelled] = await Promise.all([
        reservationService.getReservations({ pageNumber: 1, pageSize: 1, date: dateStr }),
        reservationService.getReservations({
          pageNumber: 1,
          pageSize: 1,
          date: dateStr,
          status: "booked",
        }),
        reservationService.getReservations({
          pageNumber: 1,
          pageSize: 1,
          date: dateStr,
          status: "checked_in",
        }),
        reservationService.getReservations({
          pageNumber: 1,
          pageSize: 1,
          date: dateStr,
          status: "cancelled",
        }),
      ]);
      if (resAll.isSuccess) setStatsTotal(resAll.data.totalCount);
      if (resBooked.isSuccess) setStatsBooked(resBooked.data.totalCount);
      if (resCheckedIn.isSuccess) setStatsCheckedIn(resCheckedIn.data.totalCount);
      if (resCancelled.isSuccess) setStatsCancelled(resCancelled.data.totalCount);
    } catch (err) {
      console.error(err);
    }
  }, [dateStr]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchReservations();
      await fetchStats();
    };
    fetchData();
  }, [fetchReservations, fetchStats]);

  const handleRefresh = useCallback(() => {
    fetchReservations();
    fetchStats();
  }, [fetchReservations, fetchStats]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || NUMBERSTARTPAGE;

  const resetFilters = () => {
    setSearch("");
    setDateStr(format(new Date(), "yyyy-MM-dd"));
    setArea("all");
    setStatus("all");
    setCurrentPage(NUMBERSTARTPAGE);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm h-full flex flex-col">
      <ReservationStatus
        total={statsTotal}
        booked={statsBooked}
        checkedIn={statsCheckedIn}
        cancelled={statsCancelled}
      />

      <ReservationFilter
        search={search}
        onSearchChange={setSearch}
        date={dateStr}
        onDateChange={setDateStr}
        area={area}
        onAreaChange={setArea}
        status={status}
        onStatusChange={setStatus}
        onReset={resetFilters}
        onRefresh={handleRefresh}
      />

      <ReservationTable
        data={data}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default TableBookingBoard;
