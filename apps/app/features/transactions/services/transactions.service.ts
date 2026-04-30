import { apiFetch } from "@/app/lib/api/client";
import { CreateTransactionPayload } from "@repo/shared-types";

export async function createTransaction(payload: CreateTransactionPayload) {
  return apiFetch("/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}