import { Stack } from "expo-router";
import LoginScreen from "@/features/auth/screens/LoginScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function LoginRoute() {
  const title = "Login";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <LoginScreen />
    </>
  );
}