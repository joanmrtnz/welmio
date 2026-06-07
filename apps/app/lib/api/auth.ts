import { apiFetch } from "./client";
import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
  AuthTokensResponse,
} from "@repo/shared-types";

export function signup(payload: RegisterInput) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function sendResetPasswordCode(email: string) {
  return apiFetch<{ message: string }>("/auth/send-reset-password-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function validateResetPasswordCode(email: string, code: string) {
  return apiFetch<{ valid: boolean }>("/auth/validate-reset-password-code", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export function resetPassword(
  email: string,
  code: string,
  newPassword: string,
) {
  return apiFetch<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code, newPassword }),
  });
}

export async function login(data: LoginInput) {
  return apiFetch<AuthTokensResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuthRefresh: true,
  });
}

export async function refreshAccessToken(refreshToken: string) {
  return apiFetch<AuthTokensResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
    skipAuthRefresh: true,
  });
}

export async function logout(refreshToken?: string | null) {
  return apiFetch<void>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
    skipAuthRefresh: true,
  });
}

export async function logoutAll() {
  return apiFetch<void>("/auth/logout-all", {
    method: "POST",
  });
}
