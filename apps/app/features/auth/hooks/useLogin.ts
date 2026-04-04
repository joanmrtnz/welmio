import { useState } from "react";
import { login } from "../../../app/lib/api/auth";
import { LoginInput } from "@repo/shared-types";

export function useLogin() {
  const [loading, setLoading] = useState(false);

  async function execute(data: LoginInput) {
    setLoading(true);

    try {
      const res = await login(data);
      return res;
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading };
}