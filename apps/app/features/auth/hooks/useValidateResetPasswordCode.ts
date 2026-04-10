import { useState } from "react";
import { validateResetPasswordCode } from "@/app/lib/api/auth";

export function useValidateResetPasswordCode() {
  const [loading, setLoading] = useState(false);

  async function execute(email: string, code: string) {
    setLoading(true);

    try {
      const res = await validateResetPasswordCode(email, code);
      return res;
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading };
}