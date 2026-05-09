import { useState } from "react";
import { signup } from "@/app/lib/api/auth";
import type { RegisterInput } from "@repo/shared-types";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { setAccessToken } from "@/app/lib/auth-storage";

export function useSignup() {
  const [loading, setLoading] = useState(false);

  async function execute(data: RegisterInput) {
    setLoading(true);

    try {
      const res = await signup(data);
      
      if (res?.accessToken) {
        await setAccessToken(res.accessToken);
        feedback.success("Account created successfully");
      }
      return res;
    } catch (error) {
      feedback.error("Server error. Please try again later.");
      throw error;
    
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading };
}