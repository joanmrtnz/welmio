import { apiFetch } from "@/lib/api/client";

type EmailVerificationResponse = {
  message?: string;
};

function verifyEmail(path: string, token: string) {
  return apiFetch<EmailVerificationResponse>(path, {
    method: "POST",
    body: JSON.stringify({ token }),
    skipAuthRefresh: true,
  });
}

export function verifyAccountEmail(token: string) {
  return verifyEmail("/auth/verify-email", token);
}

export function verifyEmailChange(token: string) {
  return verifyEmail("/auth/verify-email-change", token);
}