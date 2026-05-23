import { apiFetch } from "@/lib/api/client";
import { CategoriesOverviewResponse, Category } from "@repo/shared-types";

export type CreateCategoryPayload = {
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export async function getCategoriesOverview() {
  return apiFetch<CategoriesOverviewResponse>("/categories/overview");
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiFetch<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(
  categoryId: string,
  payload: UpdateCategoryPayload,
) {
  return apiFetch<Category>(`/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(categoryId: string) {
  return apiFetch<{ id: string; deleted: boolean }>(
    `/categories/${categoryId}`,
    {
      method: "DELETE",
    },
  );
}