// store/authStore.ts
import { create } from "zustand";

import { Employee } from "@/types/Employee";

type AuthState = {
  accessToken: string | null;
  employee: Partial<Employee> | null;

  setAccessToken: (token: string | null) => void;
  setEmployee: (employee: Partial<Employee> | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  employee: null,

  setAccessToken: (token) => set({ accessToken: token }),

  setEmployee: (employee) => set({ employee }),

  logout: () => {
    set({
      accessToken: null,
      employee: null,
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
}));
