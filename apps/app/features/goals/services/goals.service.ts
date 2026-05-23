import { apiFetch } from "@/lib/api/client";
import { createTransaction } from "@/features/transactions/services/transactions.service";
import { CreateGoalContributionRecordPayload, CreateGoalPayload, CreateTransactionPayload, GoalContributionItem, GoalOverviewItem, GoalsOverviewResponse, TransactionOverviewItem, UpdateGoalPayload } from "@repo/shared-types";


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

export type CreateGoalContributionPayload = Omit<
  CreateTransactionPayload,
  "type" | "goalId"
> & {
  goalId: string;
};

export async function createGoalContribution(
  payload: CreateGoalContributionPayload,
) {
  const transaction = (await createTransaction({
    ...payload,
    type: "income",
    goalId: payload.goalId,
  })) as TransactionOverviewItem;

  await createGoalContributionRecord(payload.goalId, {
    transactionId: transaction.id,
    amount: payload.amount,
    currency: payload.currency,
    date: payload.date,
    notes: payload.notes ?? null,
  });

  return transaction;
}

export async function createGoalContributionRecord(
  goalId: string,
  payload: CreateGoalContributionRecordPayload,
) {
  return apiFetch<GoalContributionItem>(`/goals/${goalId}/contributions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteGoalContribution(
  goalId: string,
  contributionId: string,
) {
  return apiFetch<void>(`/goals/${goalId}/contributions/${contributionId}`, {
    method: "DELETE",
  });
}