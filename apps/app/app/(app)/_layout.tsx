import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect, Stack } from "expo-router";

import { checkAccessToken } from "@/features/auth/services/auth.service";
import { clearAuthTokens } from "@/lib/auth/auth-storage";

export default function ProtectedAppLayout() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function validateSession() {
      try {
        await checkAccessToken();
        setIsAuthenticated(true);
      } catch {
        await clearAuthTokens();
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    void validateSession();
  }, []);

  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
