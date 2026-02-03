// store/authStore.ts
import { create } from "zustand";

type EmployeeState = {
  refreshCount: number;
  increment: () => void;
};

export const useEmployeeStore = create<EmployeeState>((set) => ({
  refreshCount: 0,
  increment: () => set((state) => ({ refreshCount: state.refreshCount + 1 })),
}));
