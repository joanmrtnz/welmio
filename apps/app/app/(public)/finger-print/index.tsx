import { Stack } from "expo-router";
import FingerprintScreen from "@/features/auth/screens/FingerprintScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function FingerprintRoute() {
  const title = "Fingerprint";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <FingerprintScreen />
    </>
  );
}
