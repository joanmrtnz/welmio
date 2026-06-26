import { useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppImage } from "@/components/images/AppImage";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { fonts } from "@/theme/fonts";

const APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION?.trim() || "pre";
const WELMIO_LOGO = require("@/assets/images/welmio-logo.png");

const GREEN = "#12c79b";
const LIGHT_GREEN = "#ffffff";
const DARK = "#0b3437";
const CARD = "#ffffff";
const MUTED = "#6f8586";
const LIGHT_GRAY = "rgba(0, 0, 0, 0.2)";
const TAB_BAR_HEIGHT = 90;
const ANDROID_FALLBACK_BOTTOM_INSET = 10;

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
  const { locale } = useLocale();
  const insets = useSafeAreaInsets();

  const bottomInset = isDesktop
    ? 0
    : Math.max(
        insets.bottom,
        Platform.OS === "android" ? ANDROID_FALLBACK_BOTTOM_INSET : 0,
      );

  const tabTitles = useMemo(
    () => ({
      home: t("home.title"),
      analytics: t("analytics.title"),
      transactions: t("transactions.title"),
      goals: t("goals.title"),
      profile: t("profile.title"),
    }),
    [locale],
  );

  return (
    <Tabs
      key={`tabs-${locale}`}
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
          !isDesktop && {
            height: TAB_BAR_HEIGHT + bottomInset,
            paddingBottom: bottomInset,
          },
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
        key={`home-${locale}`}
        name="home/index"
        options={{
          title: tabTitles.home,
          tabBarLabel: tabTitles.home,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        key={`analytics-${locale}`}
        name="analytics/index"
        options={{
          title: tabTitles.analytics,
          tabBarLabel: tabTitles.analytics,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="bar-chart" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        key={`transactions-${locale}`}
        name="transactions/index"
        options={{
          title: tabTitles.transactions,
          tabBarLabel: tabTitles.transactions,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="exchange" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        key={`goals-${locale}`}
        name="goals/index"
        options={{
          title: tabTitles.goals,
          tabBarLabel: tabTitles.goals,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="flag" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        key={`profile-${locale}`}
        name="profile/index"
        options={{
          title: tabTitles.profile,
          tabBarLabel: tabTitles.profile,
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
    height: TAB_BAR_HEIGHT,
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