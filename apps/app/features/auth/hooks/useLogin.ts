import { useState } from "react";
import { login } from "@/app/lib/api/auth";
import { LoginInput } from "@repo/shared-types";
import { setAccessToken } from "@/app/lib/auth-storage";

export function useLogin() {
  const [loading, setLoading] = useState(false);

  async function execute(data: LoginInput) {
    setLoading(true);

    try {
      const res = await login(data);

      if (res?.accessToken) {
        await setAccessToken(res.accessToken);
      }

      return res;
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading };
}