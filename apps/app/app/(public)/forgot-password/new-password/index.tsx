import { Stack } from "expo-router";
import NewPasswordScreen from "@/features/auth/screens/NewPasswordScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function NewPasswordRoute() {
  const title = "New password";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <NewPasswordScreen />
    </>
  );
}
