import { Stack } from "expo-router";
import SignupScreen from "@/features/auth/screens/SignupScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function SignupRoute() {
  const title = "Sign up";

  return (
    <>
      <Stack.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <SignupScreen />
    </>
  );
}