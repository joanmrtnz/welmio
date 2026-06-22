import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect, Stack, usePathname } from "expo-router";

import {
  canAccessNewPassword,
  canAccessSuccess,
  canAccessVerifyCode,
  getResetPasswordFlow,
} from "@/lib/auth/reset-password-flow-storage";

const PRIMARY = "#00b889";
const SCREEN_BG = "#dff7ef";

type GuardState = "checking" | "allowed" | "redirect-forgot" | "redirect-login";

function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, "");
}

export default function ForgotPasswordLayout() {
  const pathname = usePathname();
  const [guardState, setGuardState] = useState<GuardState>("checking");

  useEffect(() => {
    let isMounted = true;

    async function validateResetFlow() {
      setGuardState("checking");

      const flow = await getResetPasswordFlow();
      const currentPathname = normalizePathname(pathname);

      let nextGuardState: GuardState = "allowed";

      if (currentPathname.endsWith("/forgot-password/verify-code")) {
        nextGuardState = canAccessVerifyCode(flow)
          ? "allowed"
          : "redirect-forgot";
      }

      if (currentPathname.endsWith("/forgot-password/new-password")) {
        nextGuardState = canAccessNewPassword(flow)
          ? "allowed"
          : "redirect-forgot";
      }

      if (currentPathname.endsWith("/forgot-password/success")) {
        nextGuardState = canAccessSuccess(flow) ? "allowed" : "redirect-login";
      }

      if (isMounted) {
        setGuardState(nextGuardState);
      }
    }

    void validateResetFlow();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  if (guardState === "checking") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={PRIMARY} />
      </View>
    );
  }

  if (guardState === "redirect-forgot") {
    return <Redirect href="/(public)/forgot-password" />;
  }

  if (guardState === "redirect-login") {
    return <Redirect href="/(public)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SCREEN_BG,
  },
});
