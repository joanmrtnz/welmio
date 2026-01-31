import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { AuthButton } from "../components/AuthButton";
import { fonts } from "@/theme/fonts";

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";

export default function FingerprintScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Text style={styles.welcome}>Security Fingerprint</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.fingerprintCircle}>
            <Text style={styles.fingerprintIcon}>⌾</Text>
          </View>

          <Text style={styles.title}>Use Fingerprint To Access</Text>

          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt.
          </Text>

          <View style={styles.buttons}>
            <AuthButton
              title="Use Touch ID"
              variant="secondary"
              onPress={() => {
                // later: trigger biometric auth
                router.replace("/(app)/(tabs)/home");
              }}
            />
          </View>

          <Text
            style={styles.pinLink}
            onPress={() => {
              router.push("/(public)/login");
            }}
          >
            Or prefer use pin code?
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  headerArea: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },

  welcome: {
    marginTop: 30,
    fontSize: 28,
    color: "#052e2b",
    fontFamily: fonts.bold,
  },

  card: {
    flex: 1,
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    padding: 24,
  },

  content: {
    marginTop: 80,
    alignItems: "center",
  },

  fingerprintCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },

  fingerprintIcon: {
    fontSize: 48,
    color: "#ffffff",
  },

  title: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: "#052e2b",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: "#052e2b",
    textAlign: "center",
    lineHeight: 16,
    width: 260,
    marginBottom: 32,
  },

  buttons: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },

  pinLink: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: "#052e2b",
  },
});

