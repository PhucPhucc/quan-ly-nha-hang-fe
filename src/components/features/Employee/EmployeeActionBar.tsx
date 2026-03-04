"use client";

import { Filter, RotateCcw, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { getEmployees } from "@/services/employeeService";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { fi } from "date-fns/locale";

const EmployeeActionBar = () => {
  const setEmployees = useEmployeeStore((state) => state.setEmployees);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const fetchData = React.useCallback(
    async (currentSearch: string, currentRole: string) => {
      const filters = currentRole !== "all" ? `role:${currentRole}` : undefined;
      const res = await getEmployees({ search: currentSearch, filters });
      if (res.isSuccess && res.data) {
        setEmployees(res.data.items || []);
      }
      console.log("search:", search);
      console.log("role:", role);
      console.log("filters:", filters);
    },
    [setEmployees]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(search, role);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, role, fetchData]);

  const handleRoleChange = (value: string) => {
    setRole(value);
    fetchData(search, value);
  };

  const handleReset = () => {
    if (!search && role === "all") return;
    setSearch("");
    setRole("all");
    fetchData("", "all");
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <Input
          placeholder={UI_TEXT.EMPLOYEE.SEARCH}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 h-11 bg-slate-50/80 border-slate-100 rounded-2xl focus-visible:ring-primary/20 focus-visible:bg-white transition-all font-medium text-sm"
        />
      </div>

      {/* Role Filter */}
      <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="h-11 w-full md:w-[180px] bg-slate-50/80 border-slate-100 rounded-2xl focus:ring-primary/20 font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={UI_TEXT.COMMON.FILTER} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-slate-100 shadow-xl p-1">
            <SelectItem value="all" className="rounded-xl">
              {UI_TEXT.COMMON.ALL}
            </SelectItem>
            <SelectItem value="1" className="rounded-xl">
              {UI_TEXT.ROLE.MANAGER}
            </SelectItem>
            <SelectItem value="2" className="rounded-xl">
              {UI_TEXT.ROLE.CASHIER}
            </SelectItem>
            <SelectItem value="3" className="rounded-xl">
              {UI_TEXT.ROLE.WAITER}
            </SelectItem>
            <SelectItem value="4" className="rounded-xl">
              {UI_TEXT.ROLE.CHEF}
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          disabled={!search && role === "all"}
          className="h-11 w-11 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all disabled:opacity-30"
          title="Làm mới"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EmployeeActionBar;
