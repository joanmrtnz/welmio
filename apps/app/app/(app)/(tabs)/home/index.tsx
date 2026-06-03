import { Tabs } from "expo-router";
import HomeScreen from "@/features/home/screens/HomeScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function HomeRoute() {
  const title = "Home";

  return (
    <>
      <Tabs.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <HomeScreen />
    </>
  );
}
