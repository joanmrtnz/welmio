import { apiFetch } from "@/app/lib/api/client";
import { CategoriesOverviewResponse } from "@repo/shared-types";

export async function getCategoriesOverview() {
  return apiFetch<CategoriesOverviewResponse>("/categories/overview");
}