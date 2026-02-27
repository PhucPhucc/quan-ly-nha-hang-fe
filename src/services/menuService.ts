import { apiFetch } from "./api";
import { MenuItem } from "@/types/Menu";

export const menuService = {
  getAll: (pageIndex = 1, pageSize = 50) =>
    apiFetch(`/MenuItem?PageIndex=${pageIndex}&PageSize=${pageSize}`),

  getById: (id: string) =>
    apiFetch(`/MenuItem/${id}`),

  // 1. Thêm món lẻ
  create: (data: any) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/MenuItem", {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,

      },
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw error;
      }
      return res.json();
    });
  },

  createSetMenu: (data: any) =>
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/SetMenu", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw error;
      }
      return res.json();
    }),
  delete: (id: string) =>
    apiFetch(`/MenuItem/${id}`, {
      method: "DELETE",
    }),

  toggleStock: (id: string, isOutOfStock: boolean) =>
    apiFetch(`/MenuItem/${id}/stock`, {
      method: "PUT",
      body: JSON.stringify({
        menuItemId: id,
        isOutOfStock,
      }),
    }),

  update: (id: string, data: any) =>
    apiFetch(`/MenuItem/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...data, menuItemId: id }),
    }),
  getAllSetMenu: (pageIndex = 1, pageSize = 50) =>
    apiFetch(`/SetMenu?PageIndex=${pageIndex}&PageSize=${pageSize}`),

  deleteSetMenu: (id: string) =>
    apiFetch(`/SetMenu/${id}`, {
      method: "DELETE",
    }),
  getSetMenuById: (id: string) =>
    apiFetch(`/SetMenu/${id}`),

  updateSetMenu: (id: string, data: any) =>
    apiFetch(`/SetMenu/${id}`, {
      method: "PUT",
      // Chỉnh sửa để khớp với Schema của SetMenu (thường không cần menuItemId bên trong body)
      body: JSON.stringify({ ...data, setMenuId: id }),
    }),
  ploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    // Gọi trực tiếp fetch vì upload file cần header đặc thù (Multipart)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Image/upload?folder=menu-items`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    return response.json();
  },
};