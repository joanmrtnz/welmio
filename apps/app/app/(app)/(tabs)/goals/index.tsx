import { Tabs } from "expo-router";
import GoalsScreen from "@/features/goals/screens/GoalsScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function GoalsRoute() {
  const title = "Goals";

  return (
    <>
      <Tabs.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <GoalsScreen />
    </>
  );
}
