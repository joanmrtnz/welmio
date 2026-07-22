import { apiFetch } from "@/lib/api/client";
import type { DevToolActionId } from "../constants/devToolActions";

export type DevToolActionResult = {
  actionId: DevToolActionId;
  success: boolean;
  message: string;
  summary?: Record<string, number | string | boolean>;
};

export async function runDevToolAction(
  actionId: DevToolActionId,
): Promise<DevToolActionResult> {
  return apiFetch<DevToolActionResult>(`/dev-tools/actions/${actionId}`, {
    method: "POST",
  });
}
