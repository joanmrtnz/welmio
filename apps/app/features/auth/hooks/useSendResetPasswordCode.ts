import { useState } from "react";
import { sendResetPasswordCode } from "@/app/lib/api/auth";

export function useSendResetPasswordCode() {
  const [loading, setLoading] = useState(false);

  async function execute(email: string) {
    setLoading(true);

    try {
      const res = await sendResetPasswordCode(email);
      return res;
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading };
}