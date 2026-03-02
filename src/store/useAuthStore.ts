// store/authStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Employee } from "@/types/Employee";

export type AuthState = {
  employee: Partial<Employee> | null;

  setEmployee: (employee: Partial<Employee> | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      employee: null,

      setEmployee: (employee) => set({ employee }),

      logout: () => {
        set({ employee: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
