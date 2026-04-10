import { apiFetch } from "./client";
import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
} from "@repo/shared-types";

export function login(payload: LoginInput) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

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