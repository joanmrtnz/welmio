import { Stack } from "expo-router";
import ForgotPasswordScreen from "@/features/auth/screens/ForgotPasswordScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function ForgotPasswordRoute() {
  const title = "Forgot password";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <ForgotPasswordScreen />
    </>
  );
}
