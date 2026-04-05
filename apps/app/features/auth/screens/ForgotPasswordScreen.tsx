import { View, Text, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import { AuthHeader } from "../components/AuthHeader";
import { fonts } from "@/theme/fonts";
import { useSendResetPasswordCode } from "@/features/auth/hooks/useSendResetPasswordCode";

const GREEN = "#00c896";
const DARK_GREEN = "#059669";
const LIGHT_GREEN = "#f1fff3";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const { execute, loading } = useSendResetPasswordCode();

  async function handleNextStep() {
    try {
      if (!email.trim()) {
        console.warn("Email is required");
        return;
      }

      const res = await execute(email.trim());

      if (res) {
        router.push({
          pathname: "/(public)/forgot-password/verify-code",
          params: { email: email.trim() },
        });
      }
    } catch (error) {
      console.warn(error);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Text style={styles.welcome}>Forgot Password</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.header}>
          <AuthHeader
            title="Reset password?"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
        </View>

        <View style={styles.form}>
          <AuthInput
            label="Enter Email Address"
            placeholder="example@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.buttons}>
            <AuthButton
              title="Next step"
              onPress={handleNextStep}
              disabled={loading}
            />

            <AuthButton
              title="Sign Up"
              variant="secondary"
              onPress={() => {
                router.push("/(public)/signup");
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
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },

  welcome: {
    marginTop: 30,
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

   header: {
    marginTop: 55,
  },

  form: {
    marginTop: 80,
    gap: 16,
  },

 buttons:{
    marginTop: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 55,
    fontFamily: fonts.medium,
  },

  footer: {
    fontSize: 11,
    textAlign: "center",
    color: "#052e2b",
    fontFamily: fonts.regular,
  },

  divider: {
    textAlign: "center",
    color: "#052e2b",
    marginTop: 15,
    fontSize: 11,
    fontFamily: fonts.regular,
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
  },

  link: {
    color: DARK_GREEN,
    fontSize: 11,
    fontFamily: fonts.semibold,
  },
});

