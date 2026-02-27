import { apiFetch } from "./api";
import { Category } from "@/types/Menu";

export const categoryService = {
    getAll: (): Promise<Category[]> =>
        apiFetch("/categories?pageNumber=1&pageSize=50"), // Đổi thành categories cho đồng nhất với Swagger

    getById: (id: string): Promise<Category> =>
        apiFetch(`/categories/${id}`),

    create: (data: { name: string; type: number }) =>
        apiFetch("/categories", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: string, data: { name: string; type: number }) =>
        apiFetch(`/categories/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        apiFetch(`/categories/${id}`, {
            method: "DELETE",
        }),
};