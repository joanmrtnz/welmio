import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { fonts } from "@/theme/fonts";

const SCREEN_BG = "#dff7ef";
const CARD_BG = "rgba(255, 255, 255, 0.88)";
const MINT_SOFT = "#d6f6ec";
const MINT_STRONG = "#08b692";
const TEXT = "#062f33";
const MUTED = "#6f858a";

export default function SuccessMessageScreen() {
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
    }, 1800);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.screen}>
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(255,255,255,0.82)", "rgba(223,247,239,0.96)", "rgba(255,255,255,0.72)"]}
        locations={[0, 0.58, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>

        <Text style={styles.title}>Password Changed</Text>
        <Text style={styles.subtitle}>
          Your password has been updated successfully
        </Text>
      </Animated.View>
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

  icon: {
    fontSize: 32,
    lineHeight: 36,
    color: MINT_STRONG,
    fontFamily: fonts.bold,
  },

  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: TEXT,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.3,
  },

  subtitle: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: MUTED,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 250,
  },
});
