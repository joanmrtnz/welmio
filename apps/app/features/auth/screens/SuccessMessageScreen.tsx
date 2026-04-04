import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { fonts } from "@/theme/fonts";

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";
const DARK_TEXT = "#052e2b";

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
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 32,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: "center",
    width: 300,
  },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  icon: {
    fontSize: 32,
    color: "#ffffff",
    fontFamily: fonts.bold,
  },

  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: DARK_TEXT,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: DARK_TEXT,
    textAlign: "center",
    lineHeight: 18,
  },
});
