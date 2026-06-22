import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { clearAuthTokens, setAuthTokens } from "@/lib/auth/auth-storage";
import { restoreAuthSession } from "@/lib/auth/auth-session";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextValue = {
  status: AuthStatus;
  isAuthenticated: boolean;
  signIn: (tokens: AuthTokens) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const restored = await restoreAuthSession();

      if (!mounted) return;

      setStatus(restored ? "authenticated" : "unauthenticated");
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  async function signIn(tokens: AuthTokens) {
    await setAuthTokens(tokens);
    setStatus("authenticated");
  }

  async function signOut() {
    await clearAuthTokens();
    setStatus("unauthenticated");
  }

  return (
    <AuthContext.Provider
      value={{
        status,
        isAuthenticated: status === "authenticated",
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}