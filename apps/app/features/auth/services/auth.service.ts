import { apiFetch } from "@/app/lib/api/client";

type AuthMeResponse = {
  valid: boolean;
  user: {
    id: string;
    email: string;
    fullName?: string | null;
    mobileNumber?: string | null;
    dateOfBirth?: string | null;
  };
};

export async function checkAccessToken() {
  return apiFetch<AuthMeResponse>("/auth/me");
}