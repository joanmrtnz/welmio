import { apiFetch } from "@/lib/api/client";
import { AccountsResponse } from "@repo/shared-types";

export async function getAccounts() {
  return apiFetch<AccountsResponse>("/accounts");
}