import { Redirect } from "expo-router";
import { View } from "react-native";

import { useAuth } from "@/lib/auth/auth-context";

export default function Index() {
  const { status } = useAuth();

  if (status === "loading") {
    return <View />;
  }

  if (status === "authenticated") {
    return <Redirect href="/(app)/(tabs)/home" />;
  }

  return <Redirect href="/(public)/login" />;
}