import { Stack } from "expo-router";
import VerifyEmailChangeScreen from "@/features/auth/screens/VerifyEmail";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function VerifyEmailChangeRoute() {
  const title = "Verify Email Change";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <VerifyEmailChangeScreen />
    </>
  );
}