import { Stack } from "expo-router";
import SuccessMessageScreen from "@/features/auth/screens/SuccessMessageScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function SuccessMessageRoute() {
  const title = "Password changed";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <SuccessMessageScreen />
    </>
  );
}
