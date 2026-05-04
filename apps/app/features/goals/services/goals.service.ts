import { apiFetch } from "@/app/lib/api/client";
import { CreateGoalPayload, GoalOverviewItem, GoalsOverviewResponse } from "@repo/shared-types";


export async function getGoalsOverview() {
  return apiFetch<GoalsOverviewResponse>("/goals/overview");
}

export async function createGoal(payload: CreateGoalPayload) {
  return apiFetch<GoalOverviewItem>("/goals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}