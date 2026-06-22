import { useState } from "react";
import { login } from "@/lib/api/auth";
import { LoginInput } from "@repo/shared-types";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  async function execute(data: LoginInput) {
    setLoading(true);

    try {
      const res = await login(data);

      if (res?.accessToken && res?.refreshToken) {
        await signIn({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        });

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
