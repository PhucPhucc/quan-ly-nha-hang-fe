import { toast } from "sonner";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { UI_TEXT } from "@/lib/UI_Text";
import { tableService } from "@/services/tableService";
import { Area, AreaStatus, Table, TableStatus } from "@/types/Table-Layout";

interface TableState {
  // data
  areas: Area[];
  tables: Table[];
  selectedAreaId: string;

  // ui state
  isLoading: boolean;
  searchQuery: string;

  // actions
  setAreas: (areas: Area[]) => void;
  setTables: (tables: Table[]) => void;
  setSelectedAreaId: (id: string) => void;
  setSearchQuery: (searchQuery: string) => void;

  // thunks
  fetchAreas: () => Promise<void>;
  fetchTablesByArea: (areaId: string) => Promise<void>;
  createTable: (capacity: number, areaId: string) => Promise<void>;
  updateTableInfo: (
    tableId: string,
    payload: { tableNumber: number; capacity: number; areaId: string }
  ) => Promise<void>;
  updateTableCurrentStatus: (tableId: string, isActive: boolean) => Promise<void>;
  updateTableStatusRealtime: (tableId: string, statusKey: string) => void;
}

export const useTableStore = createWithEqualityFn<TableState>(
  (set, get) => ({
    // ---------- state ----------
    areas: [],
    tables: [],
    selectedAreaId: "",
    isLoading: false,
    searchQuery: "",

    // ---------- simple setters ----------
    setAreas: (areas) => set({ areas }),
    setTables: (tables) => set({ tables }),
    setSelectedAreaId: (id) => set({ selectedAreaId: id }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),

    // ---------- thunks ----------
    fetchAreas: async () => {
      set({ isLoading: true });
      try {
        const response = await tableService.getAreas();
        if (response.isSuccess && response.data) {
          set({ areas: response.data });

          const activeAreas = response.data.filter((a) => a.status === AreaStatus.Active);
          const { selectedAreaId } = get();
          if (activeAreas.length > 0 && !selectedAreaId) {
            set({ selectedAreaId: activeAreas[0].areaId });
          }
        }
      } catch (error) {
        console.error("Failed to fetch areas:", error);
        toast.error(UI_TEXT.TABLE.FETCH_AREA_ERROR);
      } finally {
        set({ isLoading: false });
      }
    },

    fetchTablesByArea: async (areaId: string) => {
      set({ isLoading: true });
      try {
        const response = await tableService.getTables(areaId);
        if (response.isSuccess && response.data) {
          set({ tables: response.data });
        }
      } catch (error) {
        console.error("Failed to fetch tables:", error);
        toast.error(UI_TEXT.TABLE.FETCH_TABLE_ERROR);
      } finally {
        set({ isLoading: false });
      }
    },

    createTable: async (capacity, areaId) => {
      try {
        const response = await tableService.createTable({
          capacity,
          areaId,
        });

        if (response.isSuccess) {
          toast.success(UI_TEXT.TABLE.ADD_TABLE_SUCCESS);
          // Refresh tables
          await get().fetchTablesByArea(areaId);
        }
      } catch (error) {
        console.error("Failed to create table:", error);
        toast.error(UI_TEXT.TABLE.ADD_TABLE_ERROR);
      }
    },

    updateTableInfo: async (tableId, payload) => {
      try {
        const response = await tableService.updateTable(tableId, payload);
        if (response.isSuccess && response.data) {
          toast.success(UI_TEXT.TABLE.UPDATE_SUCCESS);
          // Instead of refetching all tables, let's update the specific one in state
          const updatedTable = response.data;
          set((state) => ({
            tables: state.tables.map((t) =>
              t.tableId === updatedTable.tableId ? updatedTable : t
            ),
          }));
        }
      } catch (err) {
        toast.error((err as Error).message || UI_TEXT.TABLE.UPDATE_ERROR);
      }
    },

    updateTableCurrentStatus: async (tableId, isActive) => {
      try {
        const response = await tableService.updateTableStatus(tableId, isActive);
        if (response.isSuccess) {
          toast.success(
            isActive ? UI_TEXT.TABLE.ACTIVATE_SUCCESS : UI_TEXT.TABLE.DEACTIVATE_SUCCESS
          );
          // Update the table status locally
          set((state) => ({
            tables: state.tables.map((t) => {
              if (t.tableId === tableId) {
                return {
                  ...t,
                  status: isActive ? TableStatus.Available : TableStatus.OutOfService,
                };
              }
              return t;
            }),
          }));
        }
      } catch {
        toast.error(UI_TEXT.TABLE.OPERATION_FAILED);
      }
    },

    updateTableStatusRealtime: (tableId: string, statusKey: string) => {
      // statusKey: "Available", "Occupied", "Cleaning", "Reserved", "OutOfService"
      const mappedStatus =
        TableStatus[statusKey as keyof typeof TableStatus] || TableStatus.Available;

      set((state) => ({
        tables: state.tables.map((t) => {
          if (t.tableId === tableId) {
            return {
              ...t,
              status: mappedStatus,
            };
          }
          return t;
        }),
      }));
    },
  }),
  shallow
);
