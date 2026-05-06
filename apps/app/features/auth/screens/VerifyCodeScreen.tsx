import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { fonts } from "@/theme/fonts";
import { useValidateResetPasswordCode } from "@/features/auth/hooks/useValidateResetPasswordCode";
import { useSendResetPasswordCode } from "@/features/auth/hooks/useSendResetPasswordCode";

const WELMIO_LOGO = require("@/assets/images/welmio-logo-no-circle.png");

const GREEN = "#dff7ef";
const PRIMARY = "#00b889";
const PRIMARY_DARK = "#079374";
const DARK = "#052e2b";
const MUTED = "#6f8586";
const CARD = "#ffffff";
const SOFT_GREEN = "#e3f8f1";
const LIGHT_GRAY = "rgba(0, 0, 0, 0.2)";

export default function VerifyCodeScreen() {
  const [code, setCode] = useState("");
  const { email } = useLocalSearchParams<{ email?: string }>();

  const { execute, loading } = useValidateResetPasswordCode();
  const { execute: resendCode, loading: resendLoading } =
    useSendResetPasswordCode();

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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandArea}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Image
                source={WELMIO_LOGO}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandName}>Welmio</Text>
          </View>
        </View>

        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <FontAwesome name="lock" size={44} color={PRIMARY} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Verify code</Text>
          <Text style={styles.subtitle}>
            Enter the recovery code we sent to your email to continue.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Recovery code</Text>
              <View style={styles.inputShell}>
                <FontAwesome
                  name="key"
                  size={17}
                  color="rgba(5, 46, 43, 0.5)"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your code"
                  placeholderTextColor="rgba(5, 46, 43, 0.42)"
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={code}
                  onChangeText={setCode}
                />
              </View>
            </View>

            <View style={styles.actionButtons}>
              <Pressable
                onPress={handleAccept}
                disabled={loading}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && !loading ? styles.buttonPressed : null,
                  loading ? styles.buttonDisabled : null,
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Checking..." : "Accept"}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSendAgain}
                disabled={resendLoading}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && !resendLoading ? styles.buttonPressed : null,
                  resendLoading ? styles.buttonDisabled : null,
                ]}
              >
                <Text style={styles.secondaryButtonText}>
                  {resendLoading ? "Sending..." : "Send again"}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => router.push("/(public)/login")}
              style={({ pressed }) => [
                styles.ghostButton,
                pressed ? styles.buttonPressed : null,
              ]}
            >
              <Text style={styles.ghostButtonText}>Back to Log In</Text>
            </Pressable>

            <Link href="/(public)/signup" style={styles.footer}>
              <Text>
                Don’t have an account? <Text style={styles.link}>Sign Up</Text>
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>

      <LinearGradient
        pointerEvents="none"
        colors={["rgba(223, 247, 239, 0)", "rgba(223, 247, 239, 0.92)"]}
        style={styles.bottomFade}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 34,
    paddingBottom: 30,
  },

  brandArea: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 42,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  logoBadge: {
    width: 31,
    height: 31,
    borderRadius: 18,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    borderColor: LIGHT_GRAY,
    borderWidth: 1,
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  logoImage: {
    width: 30,
    height: 29,
  },

  brandName: {
    fontSize: 24,
    color: DARK,
    fontFamily: fonts.bold,
  },

  avatarWrap: {
    zIndex: 2,
    alignItems: "center",
    marginBottom: -42,
  },

  avatarCircle: {
    width: 106,
    height: 106,
    borderRadius: 58,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(29, 100, 89, 0.16)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 66,
    paddingBottom: 30,
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },

  title: {
    color: DARK,
    fontSize: 25,
    textAlign: "center",
    fontFamily: fonts.bold,
  },

  subtitle: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    fontFamily: fonts.medium,
    marginTop: 8,
    marginBottom: 28,
    paddingHorizontal: 18,
  },

  form: {
    gap: 14,
  },

  inputGroup: {
    gap: 8,
  },

  inputLabel: {
    color: DARK,
    fontSize: 13,
    fontFamily: fonts.semibold,
  },

  inputShell: {
    height: 50,
    borderRadius: 12,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(5, 46, 43, 0.12)",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 14,
    shadowColor: "rgba(29, 100, 89, 0.05)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  inputIcon: {
    width: 23,
    borderRightColor: "rgba(5, 46, 43, 0.12)",
    borderRightWidth: 1.5,
    margin: 10,
  },

  textInput: {
    flex: 1,
    height: "100%",
    color: DARK,
    fontSize: 15,
    letterSpacing: 2,
    fontFamily: fonts.medium,
    paddingVertical: 0,
  },

  actionButtons: {
    alignItems: "center",
    gap: 18,
    marginTop: 16,
  },

  primaryButton: {
    width: "74%",
    height: 46,
    borderRadius: 26,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 184, 137, 0.26)",
    shadowOpacity: 1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  primaryButtonText: {
    color: CARD,
    fontSize: 14,
    fontFamily: fonts.bold,
  },

  secondaryButton: {
    width: "74%",
    height: 46,
    borderRadius: 26,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: DARK,
    fontSize: 14,
    fontFamily: fonts.bold,
  },

  ghostButton: {
    alignSelf: "center",
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  ghostButtonText: {
    color: PRIMARY_DARK,
    fontSize: 13,
    fontFamily: fonts.bold,
  },

  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  footer: {
    marginTop: 12,
    fontSize: 13,
    textAlign: "center",
    color: DARK,
    fontFamily: fonts.regular,
  },

  link: {
    color: PRIMARY_DARK,
    fontFamily: fonts.bold,
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 115,
  },
});
