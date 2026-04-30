import { apiFetch } from "@/app/lib/api/client";
import { CategoriesOverviewResponse, Category } from "@repo/shared-types";


export type CreateCategoryPayload = {
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
};

export async function getCategoriesOverview() {
  return apiFetch<CategoriesOverviewResponse>("/categories/overview");
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiFetch<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}