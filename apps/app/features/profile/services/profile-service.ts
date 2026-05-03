import { apiFetch } from "@/app/lib/api/client";
import {
  ChangePasswordPayload,
  UpdateUserProfilePayload,
  User,
} from "@repo/shared-types";

export async function getUserProfile() {
  return apiFetch<User>("/users/me", {
    method: "GET",
  });
}

export async function updateUserProfile(payload: UpdateUserProfilePayload) {
  return apiFetch<User>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function changePassword(payload: ChangePasswordPayload) {
  return apiFetch<{ success: boolean }>("/users/me/password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}