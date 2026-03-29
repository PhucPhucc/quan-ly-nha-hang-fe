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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-card-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder={UI_TEXT.EMPLOYEE.SEARCH_BAR_PLACEHOLDER}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 bg-card border rounded-lg focus-visible:ring-primary/20 transition-all font-medium text-sm"
        />
      </div>

      {/* Role Filter */}
      <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className=" w-full md:w-32 bg-card border rounded-lg focus:ring-primary/20 font-medium text-card-foreground">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder={UI_TEXT.COMMON.FILTER} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="all">{UI_TEXT.COMMON.ALL}</SelectItem>
            <SelectItem value="1">{UI_TEXT.ROLE.MANAGER}</SelectItem>
            <SelectItem value="2">{UI_TEXT.ROLE.CASHIER}</SelectItem>
            <SelectItem value="3">{UI_TEXT.ROLE.CHEF}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          disabled={!search && role === "all"}
          className=" w-11 text-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-all disabled:opacity-30"
          title={UI_TEXT.COMMON.REFRESH}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EmployeeActionBar;
