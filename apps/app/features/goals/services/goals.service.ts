import { apiFetch } from "@/app/lib/api/client";
import { CreateGoalPayload, GoalContributionItem, GoalOverviewItem, GoalsOverviewResponse, UpdateGoalPayload } from "@repo/shared-types";


export async function getGoalsOverview() {
  return apiFetch<GoalsOverviewResponse>("/goals/overview");
}

export async function createGoal(payload: CreateGoalPayload) {
  return apiFetch<GoalOverviewItem>("/goals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateGoal(goalId: string, payload: UpdateGoalPayload) {
  return apiFetch<GoalOverviewItem>(`/goals/${goalId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteGoal(goalId: string) {
  return apiFetch<void>(`/goals/${goalId}`, {
    method: "DELETE",
  });
}

export async function getGoalContributions(goalId: string) {
  return apiFetch<GoalContributionItem[]>(`/goals/${goalId}/contributions`);
}