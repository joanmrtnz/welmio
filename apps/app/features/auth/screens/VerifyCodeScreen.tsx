import { View, Text, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import { fonts } from "@/theme/fonts";

const GREEN = "#00c896";
const DARK_GREEN = "#059669";
const LIGHT_GREEN = "#f1fff3";

export default function VerifyCodeScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Text style={styles.welcome}>Recovery Code</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.form}>
          <AuthInput
            label="Enter Recovery Code"
            keyboardType="number-pad"
            textContentType="oneTimeCode"
          />

          <View style={styles.buttons}>
            <AuthButton
              title="Accept"
              onPress={() => {
                router.push("/(public)/forgot-password/new-password");
              }}
            />

            <AuthButton
              title="Send Again"
              variant="secondary"
              onPress={() => {
                // later: resend code
              }}
            />
          </View>

          <Text style={styles.divider}>or sign up with</Text>

          <View style={styles.socialCircle}>
            <Text style={styles.socialText}>G</Text>
          </View>

          <Link href="/(public)/signup" style={styles.footer}>
            <Text>
              Don't have an account?{" "}
              <Text style={styles.link}>Sign Up</Text>
            </Text>
          </Link>
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
    height: 130,
    justifyContent: "center",
    alignItems: "center",
  },

  welcome: {
    fontSize: 31,
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

  form: {
    marginTop: 90,
    gap: 24,
  },

  buttons: {
    alignItems: "center",
    gap: 24,
    marginTop: 24,
  },

  divider: {
    textAlign: "center",
    color: "#052e2b",
    fontSize: 11,
    fontFamily: fonts.regular,
    marginTop: 40,
  },

  socialCircle: {
    width: 40,
    height: 40,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#052e2b",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  socialText: {
    fontSize: 20,
    fontFamily: fonts.bold,
  },

  footer: {
    fontSize: 11,
    textAlign: "center",
    color: "#052e2b",
    fontFamily: fonts.regular,
  },

  link: {
    color: DARK_GREEN,
    fontSize: 11,
    fontFamily: fonts.semibold,
  },
});

