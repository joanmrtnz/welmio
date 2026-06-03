import { Stack } from "expo-router";
import VerifyCodeScreen from "@/features/auth/screens/VerifyCodeScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function VerifyCodeRoute() {
  const title = "Verify code";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <VerifyCodeScreen />
    </>
  );
}
