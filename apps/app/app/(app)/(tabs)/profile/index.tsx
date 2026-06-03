import { Tabs } from "expo-router";
import ProfileScreen from "@/features/profile/screens/ProfileScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function ProfileRoute() {
  const title = "Profile";

  return (
    <>
      <Tabs.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <ProfileScreen />
    </>
  );
}
