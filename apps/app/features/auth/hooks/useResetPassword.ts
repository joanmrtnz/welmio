import { useState } from "react";
import { resetPassword } from "@/lib/api/auth";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);

  async function execute(
    email: string,
    code: string,
    newPassword: string,
  ) {
    setLoading(true);

    try {
      const res = await resetPassword(email, code, newPassword);
      return res;
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading };
}