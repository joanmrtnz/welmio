import { View, Text, StyleSheet, Animated, useWindowDimensions } from "react-native";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "@/lib/i18n";
import { fonts } from "@/theme/fonts";

const SCREEN_BG = "#dff7ef";
const CARD_BG = "rgba(255, 255, 255, 0.88)";
const MINT_SOFT = "#d6f6ec";
const MINT_STRONG = "#08b692";
const TEXT = "#062f33";
const MUTED = "#6f858a";

export default function SuccessMessageScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      router.replace("/(public)/login");
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.screen}>
      <LinearGradient
        pointerEvents="none"
        colors={[
          "rgba(255,255,255,0.82)",
          "rgba(223,247,239,0.96)",
          "rgba(255,255,255,0.72)",
        ]}
        locations={[0, 0.58, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.content, isDesktop && styles.contentDesktop]}>
        {isDesktop ? (
          <View style={styles.desktopIntro}>
            <Text style={styles.desktopHeadline}>
              {t("auth.successMessageScreen.desktopHeadline")}
            </Text>

            <Text style={styles.desktopText}>
              {t("auth.successMessageScreen.desktopText")}
            </Text>
          </View>
        ) : null}

        <Animated.View
          style={[
            styles.card,
            isDesktop && styles.cardDesktop,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <View style={[styles.iconCircle, isDesktop && styles.iconCircleDesktop]}>
            <Text style={[styles.icon, isDesktop && styles.iconDesktop]}>✓</Text>
          </View>

          <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
            {t("auth.successMessageScreen.title")}
          </Text>

          <Text style={[styles.subtitle, isDesktop && styles.subtitleDesktop]}>
            {t("auth.successMessageScreen.subtitle")}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SCREEN_BG,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
  },

  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  contentDesktop: {
    maxWidth: 1040,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 64,
    paddingHorizontal: 32,
  },

  desktopIntro: {
    flex: 1,
    maxWidth: 430,
  },

  desktopBrandBadge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: MINT_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(8, 182, 146, 0.16)",
  },

  desktopBrandBadgeText: {
    fontSize: 30,
    lineHeight: 34,
    color: MINT_STRONG,
    fontFamily: fonts.bold,
  },

  desktopHeadline: {
    fontSize: 42,
    lineHeight: 48,
    fontFamily: fonts.bold,
    color: TEXT,
    letterSpacing: -0.8,
    marginBottom: 16,
  },

  desktopText: {
    fontSize: 17,
    lineHeight: 27,
    fontFamily: fonts.regular,
    color: MUTED,
  },

  card: {
    width: "100%",
    maxWidth: 330,
    minHeight: 284,
    backgroundColor: CARD_BG,
    borderRadius: 30,
    paddingVertical: 42,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.75)",
    shadowColor: "rgba(30, 95, 82, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },

  cardDesktop: {
    flex: 1,
    maxWidth: 420,
    minHeight: 340,
    borderRadius: 34,
    paddingVertical: 52,
    paddingHorizontal: 40,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: MINT_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 34,
    elevation: 6,
  },

  iconCircleDesktop: {
    width: 86,
    height: 86,
    borderRadius: 43,
    marginBottom: 38,
  },

  icon: {
    fontSize: 32,
    lineHeight: 36,
    color: MINT_STRONG,
    fontFamily: fonts.bold,
  },

  iconDesktop: {
    fontSize: 38,
    lineHeight: 42,
  },

  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: TEXT,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.3,
  },

  titleDesktop: {
    fontSize: 28,
    marginBottom: 14,
  },

  subtitle: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: MUTED,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 250,
  },

  subtitleDesktop: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 300,
  },
});