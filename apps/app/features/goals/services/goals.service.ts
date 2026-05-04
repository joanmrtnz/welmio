import { apiFetch } from "@/app/lib/api/client";
import { GoalsOverviewResponse } from "@repo/shared-types";

export async function getGoalsOverview() {
  return apiFetch<GoalsOverviewResponse>("/goals/overview");
}