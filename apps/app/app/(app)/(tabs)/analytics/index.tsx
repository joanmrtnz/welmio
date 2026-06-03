import { Tabs } from "expo-router";
import AnalyticsScreen from "@/features/analytics/screens/AnalyticsScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function AnalyticsRoute() {
  const title = "Analytics";

  return (
    <>
      <Tabs.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <AnalyticsScreen />
    </>
  );
}
