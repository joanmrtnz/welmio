import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Redirect, Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { checkAccessToken } from "@/features/auth/services/auth.service";
import { clearAuthTokens } from "@/lib/auth-storage";
import { AppImage } from "@/components/images/AppImage";
import { fonts } from "@/theme/fonts";

const APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION ?? "pre";
const WELMIO_LOGO = require("@/assets/images/welmio-logo.png");

const GREEN = "#12c79b";
const LIGHT_GREEN = "#ffffff";
const DARK = "#0b3437";
const CARD = "#ffffff";
const MUTED = "#6f8586";
const LIGHT_GRAY = "rgba(0, 0, 0, 0.2)";

function DesktopSidebar() {
  return (
    <View pointerEvents="none" style={styles.sidebar}>
      <View style={styles.sidebarBrand}>
        <View style={styles.sidebarLogoBadge}>
          <AppImage
            source={WELMIO_LOGO}
            style={styles.sidebarLogoImage}
          />
        </View>

        <Text style={styles.sidebarBrandName}>Welmio</Text>
      </View>

      <Text style={styles.sidebarVersion}>{APP_VERSION}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function validateSession() {
      try {
        await checkAccessToken();
        setIsAuthenticated(true);
      } catch {
        await clearAuthTokens();
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    validateSession();
  }, []);

  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: DARK,
        tabBarPosition: isDesktop ? "left" : "bottom",
        tabBarVariant: isDesktop ? "material" : "uikit",
        tabBarLabelPosition: isDesktop ? "beside-icon" : "below-icon",
        tabBarBackground: isDesktop
          ? () => <DesktopSidebar />
          : undefined,
        tabBarStyle: [
          styles.tabBar,
          isDesktop ? styles.tabBarDesktop : styles.tabBarMobile,
        ],
        tabBarItemStyle: [
          styles.tabItem,
          isDesktop ? styles.tabItemDesktop : styles.tabItemMobile,
        ],
        tabBarShowLabel: true,
        tabBarLabelStyle: [
          styles.tabBarLabelStyle,
          isDesktop && styles.tabBarLabelStyleDesktop,
        ],
      }}
    >
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tabBar: {
    backgroundColor: LIGHT_GREEN,
    borderColor: "rgba(9, 169, 130, 0.12)",
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  tabBarMobile: {
    position: "absolute",
    height: 90,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 0,
    borderWidth: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },

  tabBarDesktop: {
    width: 232,
    borderRightWidth: 1,
    borderTopWidth: 0,
    borderRightColor: "rgba(5, 46, 43, 0.08)",
    paddingTop: 104,
    paddingBottom: 76,
    paddingHorizontal: 12,
  },

  tabItem: {
    borderRadius: 22,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  tabItemMobile: {
    height: 62,
    justifyContent: "center",
    alignItems: "center",
  },

  tabItemDesktop: {
    minHeight: 58,
    marginVertical: 12,
    paddingHorizontal: 12,
  },

  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },

  tabBarLabelStyleDesktop: {
    fontSize: 14,
    marginTop: 0,
    marginLeft: 20,
    textAlign: "left",
  },

  sidebar: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 28,
    paddingHorizontal: 18,
    paddingBottom: 24,
    justifyContent: "space-between",
    backgroundColor: CARD,
  },

  sidebarBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  sidebarLogoBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  sidebarLogoImage: {
    width: "100%",
    height: "100%",
  },

  sidebarBrandName: {
    fontSize: 22,
    color: DARK,
    fontFamily: fonts.bold,
  },

  sidebarVersion: {
    borderTopWidth: 2,
    borderBlockColor: LIGHT_GRAY,
    paddingTop: 15,
    color: MUTED,
    opacity: 0.72,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});