import { ApiResponse, PaginationResult } from "@/types/Api";
import { MenuItemOptionGroup, OptionGroup, OptionItem } from "@/types/Menu";

import { apiFetch } from "./api";

interface RawOptionItem {
  optionItemId: string;
  optionGroupId: string;
  label?: string;
  value?: string;
  extraPrice?: number | string;
  sortOrder?: number | string;
  isActive?: boolean;
  isVisible?: boolean;
}

interface RawOptionGroup {
  optionGroupId: string;
  name?: string;
  optionType?: number;
  type?: number;
  isActive?: boolean;
  isVisible?: boolean;
  optionItems?: RawOptionItem[];
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
  optionGroup?: {
    optionGroupId: string;
    name?: string;
    optionType?: number;
    usageCount?: number;
    optionItems?: RawOptionItem[];
    createdAt?: string;
    updatedAt?: string;
  };
}

interface RawAssignment {
  menuItemOptionGroupId: string;
  menuItemId: string;
  optionGroupId?: string;
  optionGroup?: RawOptionGroup;
  isRequired?: boolean;
  minSelect?: number;
  maxSelect?: number;
  sortOrder?: number;
  isVisible?: boolean;
}

const mapApiResponse = <TRaw, TMapped>(
  response: ApiResponse<TRaw>,
  mapper: (data: TRaw) => TMapped
): ApiResponse<TMapped> => ({
  ...response,
  data: mapper(response.data),
});

const mapOptionItem = (raw: RawOptionItem): OptionItem => ({
  optionItemId: raw.optionItemId,
  optionGroupId: raw.optionGroupId,
  label: raw.label ?? raw.value ?? "",
  value: raw.value ?? raw.label ?? "",
  extraPrice: Number(raw.extraPrice ?? 0),
  sortOrder: Number(raw.sortOrder ?? 0),
  isActive: raw.isVisible ?? raw.isActive ?? true,
});

const mapOptionGroup = (raw: RawOptionGroup): OptionGroup => ({
  optionGroupId: raw.optionGroupId,
  name: raw.name ?? raw.optionGroup?.name ?? "",
  optionType: Number(
    raw.optionType ?? raw.type ?? raw.optionGroup?.optionType ?? 1
  ) as OptionGroup["optionType"],
  isActive: raw.isVisible ?? raw.isActive ?? true,
  optionItems: (raw.optionItems ?? raw.optionGroup?.optionItems ?? []).map(mapOptionItem),
  usageCount: raw.usageCount ?? raw.optionGroup?.usageCount,
  createdAt: raw.createdAt ?? raw.optionGroup?.createdAt,
  updatedAt: raw.updatedAt ?? raw.optionGroup?.updatedAt,
});

const mapAssignment = (raw: RawAssignment): MenuItemOptionGroup => {
  const optionGroup = mapOptionGroup((raw.optionGroup ?? raw) as unknown as RawOptionGroup);
  const fallbackMax = optionGroup.optionType === 1 ? 1 : optionGroup.optionItems?.length || 1;
  const fallbackMin = optionGroup.optionType === 1 ? 1 : 0;

  return {
    menuItemOptionGroupId: raw.menuItemOptionGroupId,
    menuItemId: raw.menuItemId,
    optionGroupId: raw.optionGroupId ?? raw.optionGroup?.optionGroupId ?? "",
    optionGroup,
    isRequired: raw.isRequired ?? false,
    minSelect: raw.minSelect ?? fallbackMin,
    maxSelect: raw.maxSelect ?? fallbackMax,
    sortOrder: raw.sortOrder ?? 0,
    isVisible: raw.isVisible ?? true,
  };
};

export const optionService = {
  // --- Reusable Option Groups (Master Data) ---

  /**
   * Get all reusable option groups (Library)
   */
  getAllReusable: (
    pageNum: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<PaginationResult<OptionGroup>>> =>
    apiFetch<PaginationResult<RawOptionGroup>>(
      `/Options/reusable?PageNumber=${pageNum}&PageSize=${pageSize}`
    ).then((res) =>
      mapApiResponse(res, (data) => ({
        ...data,
        items: data.items.map(mapOptionGroup),
      }))
    ),

  /**
   * Create a new option group
   */
  createReusable: (data: Partial<OptionGroup>): Promise<ApiResponse<OptionGroup>> =>
    apiFetch<RawOptionGroup>("/Options/group", {
      method: "POST",
      body: {
        name: data.name,
        type: data.optionType,
        isRequired: data.isRequired || false,
        isVisible: data.isActive !== undefined ? data.isActive : true,
      },
    }).then((res) => mapApiResponse(res, mapOptionGroup)),

  /**
   * Update an existing option group
   */
  updateReusable: (id: string, data: Partial<OptionGroup>): Promise<ApiResponse<OptionGroup>> =>
    apiFetch<RawOptionGroup>(`/Options/group/${id}`, {
      method: "PUT",
      body: {
        name: data.name,
        type: data.optionType,
        isRequired: data.isRequired || false,
        isVisible: data.isActive !== undefined ? data.isActive : true,
      },
    }).then((res) => mapApiResponse(res, mapOptionGroup)),

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
    apiFetch<RawAssignment[]>(`/Options/menu-item/${menuItemId}`).then((res) =>
      mapApiResponse(res, (data) => data.map(mapAssignment))
    ),

  getOptionGroupsByMenuItem: (menuItemId: string): Promise<ApiResponse<MenuItemOptionGroup[]>> =>
    apiFetch<RawAssignment[]>(`/Options/menu-item/${menuItemId}`).then((res) =>
      mapApiResponse(res, (data) => data.map(mapAssignment))
    ),

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

  createOptionGroup: (data: Partial<OptionGroup>): Promise<ApiResponse<OptionGroup>> =>
    apiFetch<RawOptionGroup>("/Options/group", {
      method: "POST",
      body: {
        menuItemId: data.menuItemId,
        name: data.name,
        type: data.optionType,
        isRequired: data.isRequired || false,
        isVisible: data.isActive !== undefined ? data.isActive : true,
      },
    }).then((res) => mapApiResponse(res, mapOptionGroup)),

  updateOptionGroup: (id: string, data: Partial<OptionGroup>): Promise<ApiResponse<OptionGroup>> =>
    apiFetch<RawOptionGroup>(`/Options/group/${id}`, {
      method: "PUT",
      body: {
        name: data.name,
        type: data.optionType,
        isRequired: data.isRequired || false,
        isVisible: data.isActive !== undefined ? data.isActive : true,
      },
    }).then((res) => mapApiResponse(res, mapOptionGroup)),

  deleteOptionGroup: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/Options/group/${id}`, {
      method: "DELETE",
    }),

  // --- Option Items (Items inside a group) ---

  createOptionItem: (data: Partial<OptionItem>): Promise<ApiResponse<OptionItem>> =>
    apiFetch<RawOptionItem>("/Options/item", {
      method: "POST",
      body: {
        optionGroupId: data.optionGroupId,
        label: data.label,
        extraPrice: data.extraPrice,
        isVisible: data.isActive !== undefined ? data.isActive : true,
      },
    }).then((res) => mapApiResponse(res, mapOptionItem)),

  updateOptionItem: (id: string, data: Partial<OptionItem>): Promise<ApiResponse<OptionItem>> =>
    apiFetch<RawOptionItem>(`/Options/item/${id}`, {
      method: "PUT",
      body: {
        label: data.label,
        extraPrice: data.extraPrice,
        isVisible: data.isActive !== undefined ? data.isActive : true,
      },
    }).then((res) => mapApiResponse(res, mapOptionItem)),

  deleteOptionItem: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/Options/item/${id}`, {
      method: "DELETE",
    }),
};
