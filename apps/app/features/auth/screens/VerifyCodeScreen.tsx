import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  TextInput,
  View,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { fonts } from "@/theme/fonts";
import { useValidateResetPasswordCode } from "@/features/auth/hooks/useValidateResetPasswordCode";
import { useSendResetPasswordCode } from "@/features/auth/hooks/useSendResetPasswordCode";

const WELMIO_LOGO = require("@/assets/images/welmio-logo.png");

const GREEN = "#dff7ef";
const PRIMARY = "#00b889";
const PRIMARY_DARK = "#079374";
const DARK = "#052e2b";
const MUTED = "#6f8586";
const CARD = "#ffffff";
const SOFT_GREEN = "#e3f8f1";
const LIGHT_GRAY = "rgba(0, 0, 0, 0.2)";

export default function VerifyCodeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
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
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[styles.desktopShell, isDesktop && styles.desktopShellWide]}
        >
          <View
            style={[styles.brandArea, isDesktop && styles.brandAreaDesktop]}
          >
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

            {isDesktop ? (
              <View style={styles.desktopIntroCard}>
                <View style={styles.desktopIntroIcon}>
                  <FontAwesome name="lock" size={30} color={PRIMARY} />
                </View>
                <Text style={styles.desktopIntroTitle}>
                  Confirm your recovery code
                </Text>
                <Text style={styles.desktopIntroText}>
                  Enter the verification code from your email to keep your
                  password reset secure.
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={[styles.formColumn, isDesktop && styles.formColumnDesktop]}
          >
            {!isDesktop ? (
              <View style={styles.avatarWrap}>
                <View style={styles.avatarCircle}>
                  <FontAwesome name="lock" size={44} color={PRIMARY} />
                </View>
              </View>
            ) : null}

            <View style={[styles.card, isDesktop && styles.cardDesktop]}>
              <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
                Verify code
              </Text>
              <Text
                style={[styles.subtitle, isDesktop && styles.subtitleDesktop]}
              >
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
                    Don’t have an account?{" "}
                    <Text style={styles.link}>Sign Up</Text>
                  </Text>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {!isDesktop ? (
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(223, 247, 239, 0)", "rgba(223, 247, 239, 0.92)"]}
          style={styles.bottomFade}
        />
      ) : null}
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

  scrollContentDesktop: {
    paddingHorizontal: 32,
    paddingTop: 56,
    paddingBottom: 56,
    justifyContent: "center",
  },

  desktopShell: {
    width: "100%",
  },

  desktopShellWide: {
    maxWidth: 1040,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 52,
  },

  brandArea: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 42,
  },

  brandAreaDesktop: {
    flex: 1,
    alignItems: "flex-start",
    marginTop: 0,
    marginBottom: 0,
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
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
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
    position: "relative",
    zIndex: 20,
    elevation: 20,
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
    position: "relative",
    zIndex: 1,
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

  cardDesktop: {
    width: "100%",
    maxWidth: 460,
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 34,
    borderRadius: 34,
  },

  formColumn: {
    width: "100%",
  },

  formColumnDesktop: {
    flex: 1,
    alignItems: "center",
  },

  desktopIntroCard: {
    marginTop: 42,
    maxWidth: 420,
    backgroundColor: "rgba(255, 255, 255, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(5, 46, 43, 0.08)",
    borderRadius: 32,
    padding: 28,
    shadowColor: "rgba(29, 100, 89, 0.10)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },

  desktopIntroIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  desktopIntroTitle: {
    color: DARK,
    fontSize: 32,
    lineHeight: 38,
    fontFamily: fonts.bold,
    marginBottom: 12,
  },

  desktopIntroText: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 25,
    fontFamily: fonts.medium,
  },

  title: {
    color: DARK,
    fontSize: 25,
    textAlign: "center",
    fontFamily: fonts.bold,
  },

  titleDesktop: {
    fontSize: 28,
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

  subtitleDesktop: {
    paddingHorizontal: 18,
    marginBottom: 30,
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
    gap: 15,
    marginTop: 16,
  },

  primaryButton: {
    width: "80%",
    height: 52,
    borderRadius: 26,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 184, 137, 0.26)",
    shadowOpacity: 1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  primaryButtonText: {
    color: CARD,
    fontSize: 14,
    fontFamily: fonts.bold,
  },

  secondaryButton: {
    width: "80%",
    height: 52,
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
