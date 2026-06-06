import { apiFetch } from "@/lib/api/client";
import { AuthMeResponse } from "@repo/shared-types";

export async function checkAccessToken() {
  return apiFetch<AuthMeResponse>("/auth/me");
}
