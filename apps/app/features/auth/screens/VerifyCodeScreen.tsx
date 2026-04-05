import { View, Text, StyleSheet } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import { fonts } from "@/theme/fonts";
import { useValidateResetPasswordCode } from "@/features/auth/hooks/useValidateResetPasswordCode";
import { useSendResetPasswordCode } from "@/features/auth/hooks/useSendResetPasswordCode";

const GREEN = "#00c896";
const DARK_GREEN = "#059669";
const LIGHT_GREEN = "#f1fff3";

export default function VerifyCodeScreen() {
  const [code, setCode] = useState("");
  const { email } = useLocalSearchParams<{ email?: string }>();

  const { execute, loading } = useValidateResetPasswordCode();
  const { execute: resendCode, loading: resendLoading } = useSendResetPasswordCode();

  async function handleAccept() {
    try {
      if (!email) {
        console.warn("Email is missing");
        return;
      }

      if (!code.trim()) {
        console.warn("Recovery code is required");
        return;
      }

      const res = await execute(email, code.trim());

      if (res?.valid) {
        router.push({
          pathname: "/(public)/forgot-password/new-password",
          params: {
            email,
            code: code.trim(),
          },
        });
      }
    } catch (error) {
      console.warn(error);
    }
  }

  async function handleSendAgain() {
    try {
      if (!email) {
        console.warn("Email is missing");
        return;
      }

      await resendCode(email);
    } catch (error) {
      console.warn(error);
    }
  }

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
            value={code}
            onChangeText={setCode}
          />

          <View style={styles.buttons}>
            <AuthButton
              title="Accept"
              onPress={handleAccept}
              disabled={loading}
            />

            <AuthButton
              title="Send Again"
              variant="secondary"
              onPress={handleSendAgain}
              disabled={resendLoading}
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

