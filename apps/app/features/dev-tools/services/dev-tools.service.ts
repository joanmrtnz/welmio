import type { DevToolActionId } from "../constants/devToolActions";

export type DevToolActionResult = {
  actionId: DevToolActionId;
  success: boolean;
  message: string;
};

export async function runDevToolAction(
  actionId: DevToolActionId,
): Promise<DevToolActionResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    actionId,
    success: true,
    message: "Action completed in mock mode.",
  };
}
