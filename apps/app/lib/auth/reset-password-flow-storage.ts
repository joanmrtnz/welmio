import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const RESET_PASSWORD_FLOW_STORAGE_KEY = "welmio.resetPasswordFlow";
const RESET_PASSWORD_FLOW_TTL_MS = 15 * 60 * 1000;

type WebStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export type ResetPasswordFlowStep =
  | "code_sent"
  | "code_verified"
  | "password_changed";

export type ResetPasswordFlowState = {
  email: string;
  step: ResetPasswordFlowStep;
  verificationCode?: string;
  resetToken?: string;
  expiresAt: string;
  updatedAt: string;
};

type SetCodeVerifiedParams = {
  email: string;
  verificationCode: string;
  resetToken?: string;
};

function getWebStorage(): WebStorage | null {
  const globalScope = globalThis as unknown as {
    sessionStorage?: WebStorage;
    localStorage?: WebStorage;
  };

  return globalScope.sessionStorage ?? globalScope.localStorage ?? null;
}

function createExpiryDate() {
  return new Date(Date.now() + RESET_PASSWORD_FLOW_TTL_MS).toISOString();
}

function isExpired(flow: ResetPasswordFlowState) {
  return new Date(flow.expiresAt).getTime() <= Date.now();
}

async function setStorageItem(key: string, value: string) {
  if (Platform.OS === "web") {
    getWebStorage()?.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function getStorageItem(key: string) {
  if (Platform.OS === "web") {
    return getWebStorage()?.getItem(key) ?? null;
  }

  return SecureStore.getItemAsync(key);
}

async function deleteStorageItem(key: string) {
  if (Platform.OS === "web") {
    getWebStorage()?.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

async function setResetPasswordFlow(flow: ResetPasswordFlowState) {
  await setStorageItem(RESET_PASSWORD_FLOW_STORAGE_KEY, JSON.stringify(flow));
}

export async function getResetPasswordFlow() {
  const rawFlow = await getStorageItem(RESET_PASSWORD_FLOW_STORAGE_KEY);

  if (!rawFlow) {
    return null;
  }

  try {
    const flow = JSON.parse(rawFlow) as ResetPasswordFlowState;

    if (!flow.email || !flow.step || !flow.expiresAt || isExpired(flow)) {
      await clearResetPasswordFlow();
      return null;
    }

    return flow;
  } catch {
    await clearResetPasswordFlow();
    return null;
  }
}

export async function setResetPasswordCodeSent(email: string) {
  await setResetPasswordFlow({
    email,
    step: "code_sent",
    expiresAt: createExpiryDate(),
    updatedAt: new Date().toISOString(),
  });
}

export async function setResetPasswordCodeVerified({
  email,
  verificationCode,
  resetToken,
}: SetCodeVerifiedParams) {
  await setResetPasswordFlow({
    email,
    verificationCode,
    resetToken,
    step: "code_verified",
    expiresAt: createExpiryDate(),
    updatedAt: new Date().toISOString(),
  });
}

export async function setResetPasswordChanged() {
  const currentFlow = await getResetPasswordFlow();

  if (!currentFlow) {
    return;
  }

  await setResetPasswordFlow({
    ...currentFlow,
    step: "password_changed",
    expiresAt: createExpiryDate(),
    updatedAt: new Date().toISOString(),
  });
}

export async function clearResetPasswordFlow() {
  await deleteStorageItem(RESET_PASSWORD_FLOW_STORAGE_KEY);
}

export function canAccessVerifyCode(flow: ResetPasswordFlowState | null) {
  return flow?.step === "code_sent" || flow?.step === "code_verified";
}

export function canAccessNewPassword(flow: ResetPasswordFlowState | null) {
  return (
    flow?.step === "code_verified" &&
    Boolean(flow.email) &&
    Boolean(flow.resetToken || flow.verificationCode)
  );
}

export function canAccessSuccess(flow: ResetPasswordFlowState | null) {
  return flow?.step === "password_changed";
}
