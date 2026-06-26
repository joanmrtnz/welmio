import { Stack } from "expo-router";
import VerifyAccountScreen from "@/features/auth/screens/VerifyAccount";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function VerifyAccountRoute() {
  const title = "Verify Account";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <VerifyAccountScreen />
    </>
  );
}