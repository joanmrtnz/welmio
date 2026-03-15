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