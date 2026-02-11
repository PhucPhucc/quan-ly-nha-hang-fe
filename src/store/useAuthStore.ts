// store/authStore.ts
import { create } from "zustand";

import { Employee } from "@/types/Employee";

export type AuthState = {
  employee: Partial<Employee> | null;

  setEmployee: (employee: Partial<Employee> | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  employee: null,

  setEmployee: (employee) => set({ employee }),

  logout: () => {
    set({
      employee: null,
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
}));
