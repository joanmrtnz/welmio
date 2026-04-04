import { useState } from "react";
import { signup } from "@/app/lib/api/auth";
import type { RegisterInput } from "@repo/shared-types";

export function useSignup() {
  const [loading, setLoading] = useState(false);

  async function execute(data: RegisterInput) {
    setLoading(true);

    try {
      const res = await signup(data);
      return res;
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading };
}