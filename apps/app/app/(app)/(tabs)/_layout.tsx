import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const GREEN = "#00c896";
const LIGHT_GREEN = "#dff7e2";
const DARK = "#052e2b";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: DARK,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
      }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (

            <FontAwesome size={30} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics/index"
        options={{
          title: "Analytics",
         tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="bar-chart" color={color} />
        ),
        }}
      />

      <Tabs.Screen
        name="transactions/index"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={30} name="exchange" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="goals/index"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="flag" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: LIGHT_GREEN,
    height: 85,
    borderRadius: 40,
    borderTopWidth: 0,
  },
  tabItem: {
    paddingTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});