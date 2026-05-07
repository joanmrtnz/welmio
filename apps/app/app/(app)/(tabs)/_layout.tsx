import { StyleSheet, useWindowDimensions } from "react-native";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const GREEN = "#12c79b";
const LIGHT_GREEN = "#ffffff";
const DARK = "#0b3437";

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: DARK,
        tabBarStyle: [
          styles.tabBar,
          isDesktop ? styles.tabBarDesktop : styles.tabBarMobile,
        ],
        tabBarItemStyle: styles.tabItem,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarLabelPosition: "below-icon",
      }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (

            <FontAwesome size={24} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics/index"
        options={{
          title: "Analytics",
         tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="bar-chart" color={color} />
        ),
        }}
      />

      <Tabs.Screen
        name="transactions/index"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="exchange" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="goals/index"
        options={{
          title: "Goals",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="flag" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    height: 90,
    backgroundColor: LIGHT_GREEN,

    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: "rgba(9, 169, 130, 0.12)",

    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,

    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  tabBarMobile: {
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  tabBarDesktop: {
    width: 430,
    left: "50%",
    bottom: 16,
    borderRadius: 28,
    transform: [{ translateX: -215 }],
  },

  tabItem: {
    height: 62,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
});