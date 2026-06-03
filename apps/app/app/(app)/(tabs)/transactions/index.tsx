import { Tabs } from "expo-router";
import TransactionsScreen from "@/features/transactions/screens/TransactionsScreen";
import { WebPageTitle } from "@/components/WebPageTitle";

export default function TransactionsRoute() {
  const title = "Transactions";

  return (
    <>
      <Tabs.Screen options={{ title }} />
      <WebPageTitle title={title} />
      <TransactionsScreen />
    </>
  );
}
