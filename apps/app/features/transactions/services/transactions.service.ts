import { apiFetch } from "@/app/lib/api/client";
import {
  CreateTransactionPayload,
  TransactionOverviewItem,
} from "@repo/shared-types";

export async function createTransaction(payload: CreateTransactionPayload) {
  return apiFetch("/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export async function updateTransaction(
  transactionId: string,
  payload: UpdateTransactionPayload,
) {
  return apiFetch<TransactionOverviewItem>(`/transactions/${transactionId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTransaction(transactionId: string) {
  return apiFetch<{ id: string; deleted: boolean }>(
    `/transactions/${transactionId}`,
    {
      method: "DELETE",
    },
  );
}