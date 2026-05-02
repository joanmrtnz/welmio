import { useState } from "react";
import { login } from "@/app/lib/api/auth";
import { LoginInput } from "@repo/shared-types";
import { setAccessToken } from "@/app/lib/auth-storage";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { ApiError } from "@/app/lib/api/client";

export function useLogin() {
  const [loading, setLoading] = useState(false);

  async function execute(data: LoginInput) {
    setLoading(true);

    try {
      const res = await login(data);

      if (res?.accessToken) {
        await setAccessToken(res.accessToken);
        feedback.success("Login successful");
      }

      
      return res;

     } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 401) {
            feedback.error("Invalid email or password");
          } else if (error.status >= 500) {
            feedback.error("Server error. Please try again later.");
          } else {
            feedback.error(error.message);
          }
        } else {
          feedback.error("Network error. Check your connection.");
        }

        throw error;

    } finally {
      setLoading(false);
    }
  }

  return { execute, loading };
}