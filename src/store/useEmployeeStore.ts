// store/authStore.ts
import { create } from "zustand";

import { Employee } from "@/types/Employee";

type EmployeeState = {
  refreshCount: number;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  increment: () => void;
};

export const useEmployeeStore = create<EmployeeState>((set) => ({
  refreshCount: 0,
  employees: [],
  increment: () => set((state) => ({ refreshCount: state.refreshCount + 1 })),
  setEmployees: (employees) => set({ employees }),
}));
