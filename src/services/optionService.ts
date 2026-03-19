import { ApiResponse, PaginationResult } from "@/types/Api";
import { MenuItemOptionGroup, OptionGroup, OptionItem } from "@/types/Menu";

import { apiFetch } from "./api";

export const optionService = {
  // --- Reusable Option Groups (Master Data) ---

  /**
   * Get all reusable option groups (Library)
   */
  getAllReusable: (
    pageNum: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<PaginationResult<OptionGroup>>> =>
    apiFetch<PaginationResult<OptionGroup>>(
      `/Options/groups-library?PageNumber=${pageNum}&PageSize=${pageSize}`
    ),

  /**
   * Create a new option group
   */
  createReusable: (data: Partial<OptionGroup>): Promise<ApiResponse<string>> =>
    apiFetch<string>("/Options/group", {
      method: "POST",
      body: {
        menuItemId: data.menuItemId || null,
        name: data.name,
        type: data.optionType,
        isRequired: data.isRequired || false,
      },
    }),

  /**
   * Update an existing option group
   */
  updateReusable: (id: string, data: Partial<OptionGroup>): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/Options/group/${id}`, {
      method: "PUT",
      body: {
        name: data.name,
        type: data.optionType,
        isRequired: data.isRequired || false,
      },
    }),

  /**
   * Delete an option group
   */
  deleteReusable: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/Options/group/${id}`, {
      method: "DELETE",
    }),

  // --- Assignments (MenuItem <-> OptionGroup) ---

  /**
   * Get options assigned to a specific menu item
   */
  getAssignmentsByMenuItem: (menuItemId: string): Promise<ApiResponse<MenuItemOptionGroup[]>> =>
    apiFetch<MenuItemOptionGroup[]>(`/Options/menu-item/${menuItemId}`),

  /**
   * Assign a reusable group to a menu item
   */
  assignToMenuItem: (data: Partial<MenuItemOptionGroup>): Promise<ApiResponse<string>> =>
    apiFetch<string>("/Options/group/assign", {
      method: "POST",
      body: {
        menuItemId: data.menuItemId,
        optionGroupId: data.optionGroupId,
        isRequired: data.isRequired,
        minSelect: data.minSelect,
        maxSelect: data.maxSelect,
        sortOrder: data.sortOrder,
        isVisible: data.isVisible !== undefined ? data.isVisible : true,
      },
    }),

  /**
   * Update assignment rules
   */
  updateAssignment: (
    id: string,
    data: Partial<MenuItemOptionGroup>
  ): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/Options/group/assignment/${id}`, {
      method: "PUT",
      body: {
        isRequired: data.isRequired,
        minSelect: data.minSelect,
        maxSelect: data.maxSelect,
        sortOrder: data.sortOrder,
        isVisible: data.isVisible !== undefined ? data.isVisible : true,
      },
    }),

  /**
   * Unassign a group from a menu item
   */
  unassignFromMenuItem: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/Options/group/assignment/${id}`, {
      method: "DELETE",
    }),

  // --- Legacy Support & Local-only APIs ---

  createOptionGroup: (data: Partial<OptionGroup>): Promise<ApiResponse<string>> =>
    apiFetch<string>("/Options/group", {
      method: "POST",
      body: {
        menuItemId: data.menuItemId,
        name: data.name,
        type: data.optionType,
        isRequired: data.isRequired || false,
      },
    }),

  updateOptionGroup: (id: string, data: Partial<OptionGroup>): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/Options/group/${id}`, {
      method: "PUT",
      body: {
        name: data.name,
        type: data.optionType,
        isRequired: data.isRequired || false,
      },
    }),

  deleteOptionGroup: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/Options/group/${id}`, {
      method: "DELETE",
    }),

  // --- Option Items (Items inside a group) ---

  createOptionItem: (data: Partial<OptionItem>): Promise<ApiResponse<string>> =>
    apiFetch<string>("/Options/item", {
      method: "POST",
      body: {
        optionGroupId: data.optionGroupId,
        label: data.label,
        extraPrice: data.extraPrice,
      },
    }),

  updateOptionItem: (id: string, data: Partial<OptionItem>): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/Options/item/${id}`, {
      method: "PUT",
      body: {
        label: data.label,
        extraPrice: data.extraPrice,
      },
    }),

  deleteOptionItem: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/Options/item/${id}`, {
      method: "DELETE",
    }),
};
