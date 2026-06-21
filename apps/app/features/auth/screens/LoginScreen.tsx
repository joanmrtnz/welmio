import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { t } from "@/lib/i18n";
import { Link, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { fonts } from "@/theme/fonts";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { DARK_GREEN } from "@/features/transactions/components/transaction-details-modal/transactionDetails.styles";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { AppImage } from "@/components/images/AppImage";

const WELMIO_LOGO = require("@/assets/images/welmio-logo.png");
const WELMIO_AVATAR_BASE = require("@/assets/images/welmio-avatar-base.png");

const GREEN = "#dff7ef";
const PRIMARY = "#00b889";
const PRIMARY_DARK = "#079374";
const DARK = "#052e2b";
const MUTED = "#6f8586";
const CARD = "#ffffff";
const LIGHT_GRAY = "rgba(0, 0, 0, 0.2)";

type BackendErrorResponse = {
  response?: {
    data?: {
      message?: string | string[];
      code?: string;
    };
  };
  data?: {
    message?: string | string[];
    code?: string;
  };
  message?: string;
};

function getLoginErrorMessage(error: unknown) {
  const backendError = error as BackendErrorResponse;
  const responseMessage =
    backendError.response?.data?.message ?? backendError.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join("\n");
  }

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  if (typeof backendError.message === "string" && backendError.message.trim()) {
    return backendError.message;
  }

  return t("auth.login.errors.invalidCredentials");
}

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { execute, loading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    try {
      const res = await execute({
        email,
        password,
      });

      if (res) router.replace("/(app)/(tabs)/home");
    } catch (error) {
      feedback.error(getLoginErrorMessage(error));
      console.warn(error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.desktopShell, isDesktop && styles.desktopShellActive]}>
          <View style={[styles.desktopHero, isDesktop && styles.desktopHeroActive]}>
            <View style={[styles.brandArea, isDesktop && styles.brandAreaDesktop]}>
              <View style={styles.brandRow}>
                <View style={styles.logoBadge}>
                  <AppImage source={WELMIO_LOGO} style={styles.logoImage} />
                </View>

                <Text style={[styles.brandName, isDesktop && styles.brandNameDesktop]}>
                  {t("common.appName")}
                </Text>
              </View>
            </View>

            <View style={[styles.avatarWrap, isDesktop && styles.avatarWrapDesktop]}>
              <View
                style={[styles.avatarCircle, isDesktop && styles.avatarCircleDesktop]}
              >
                <View style={[styles.avatar, isDesktop && styles.avatarDesktop]}>
                  <AppImage
                    source={WELMIO_AVATAR_BASE}
                    style={[styles.avatarImage, isDesktop && styles.avatarImageDesktop]}
                  />
                </View>
              </View>
            </View>

            {isDesktop ? (
              <View style={styles.desktopCopy}>
                <Text style={styles.desktopTitle}>
                  {t("auth.login.desktopTitle")}
                </Text>

                <Text style={styles.desktopSubtitle}>
                  {t("auth.login.desktopSubtitle")}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.desktopFormColumn}>
            <View style={[styles.card, isDesktop && styles.cardDesktop]}>
              <Text style={styles.title}>{t("auth.login.title")}</Text>

              <Text style={styles.subtitle}>{t("auth.login.subtitle")}</Text>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t("auth.login.email")}</Text>

                  <View style={styles.inputShell}>
                    <FontAwesome
                      name="user-o"
                      size={18}
                      color="rgba(5, 46, 43, 0.5)"
                      style={styles.inputIcon}
                    />

                    <TextInput
                      style={styles.textInput}
                      placeholder={t("auth.login.emailPlaceholder")}
                      placeholderTextColor="rgba(5, 46, 43, 0.42)"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t("auth.login.password")}</Text>

                  <View style={styles.inputShell}>
                    <FontAwesome
                      name="lock"
                      size={19}
                      color="rgba(5, 46, 43, 0.5)"
                      style={styles.inputIcon}
                    />

                    <TextInput
                      style={styles.textInput}
                      placeholder={t("auth.login.passwordPlaceholder")}
                      placeholderTextColor="rgba(5, 46, 43, 0.42)"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />

                    <Pressable
                      hitSlop={8}
                      onPress={() => setShowPassword((visible) => !visible)}
                      style={styles.eyeButton}
                      accessibilityLabel={
                        showPassword
                          ? t("auth.login.hidePassword")
                          : t("auth.login.showPassword")
                      }
                    >
                      <FontAwesome
                        name={showPassword ? "eye-slash" : "eye"}
                        size={17}
                        color="rgba(5, 46, 43, 0.52)"
                      />
                    </Pressable>
                  </View>
                </View>

                <Link href="/(public)/forgot-password" style={styles.forgotLink}>
                  <Text>{t("auth.login.forgotPassword")}</Text>
                </Link>

                <Pressable
                  onPress={handleLogin}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && !loading ? styles.buttonPressed : null,
                    loading ? styles.buttonDisabled : null,
                  ]}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? t("auth.login.loggingIn") : t("auth.login.submit")}
                  </Text>
                </Pressable>
                {/*             
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.googleButton,
                    pressed ? styles.buttonPressed : null,
                  ]}
                >
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleText}>Continue with Google</Text>
                </Pressable>
                {!isDesktop ? (
                  <Link href="/(public)/finger-print" asChild>
                    <Pressable style={styles.fingerprint}>
                      <Icon
                        name="fingerPrint"
                        size={30}
                        strokeWidth={8}
                        color={PRIMARY}
                      />
                      <Text style={styles.fingerprintText}>
                        Continue with <Text style={styles.bold}>Touch ID</Text>
                      </Text>
                    </Pressable>
                  </Link>
                ) : null} 
                */}

                <Link href="/(public)/signup" style={styles.footer}>
                  <Text>
                    {t("auth.login.noAccount")}{" "}
                    <Text style={styles.link}>{t("auth.login.signUp")}</Text>
                  </Text>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },

  desktopShell: {
    width: "100%",
  },

  desktopShellActive: {
    maxWidth: 1040,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 42,
  },

  desktopHero: {
    position: "relative",
    zIndex: 2,
  },

  desktopHeroActive: {
    flex: 1,
    maxWidth: 430,
    alignItems: "center",
  },

  desktopFormColumn: {
    width: "100%",
    flex: 1,
    maxWidth: 460,
    alignSelf: "center",
    position: "relative",
    zIndex: 1,
  },

  brandArea: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 34,
  },

  brandAreaDesktop: {
    marginTop: 0,
    marginBottom: 24,
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
    width: "86%",
    height: "86%",
  },

  brandName: {
    fontSize: 24,
    color: DARK,
    fontFamily: fonts.bold,
  },

  brandNameDesktop: {
    fontSize: 30,
  },

  avatarWrap: {
    position: "relative",
    zIndex: 20,
    elevation: 20,
    alignItems: "center",
    marginBottom: -42,
  },

  avatarWrapDesktop: {
    marginBottom: 22,
  },

  avatarCircle: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: DARK_GREEN,
    borderColor: DARK_GREEN,
    padding: 4,
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 47,
    backgroundColor: GREEN,
    overflow: "hidden",
  },

  avatarDesktop: {
    width: "100%",
    height: "100%",
    borderRadius: 78,
    backgroundColor: GREEN,
    overflow: "hidden",
  },

  avatarCircleDesktop: {
    width: 156,
    height: 156,
    borderRadius: 78,
    padding: 6,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarImageDesktop: {
    width: "100%",
    height: "100%",
  },

  desktopCopy: {
    width: "100%",
    paddingHorizontal: 8,
    alignItems: "center",
  },

  desktopTitle: {
    color: DARK,
    fontSize: 34,
    lineHeight: 40,
    textAlign: "center",
    fontFamily: fonts.bold,
  },

  desktopSubtitle: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    marginTop: 14,
    fontFamily: fonts.medium,
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
    paddingHorizontal: 34,
    paddingTop: 38,
    paddingBottom: 34,
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
    marginBottom: 24,
    paddingHorizontal: 34,
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
    height: 48,
    borderRadius: 12,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(5, 46, 43, 0.12)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
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
    marginRight: 5,
  },

  textInput: {
    flex: 1,
    height: "100%",
    color: DARK,
    fontSize: 14,
    fontFamily: fonts.medium,
    paddingVertical: 0,
  },

  eyeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  forgotLink: {
    alignSelf: "flex-end",
    color: PRIMARY_DARK,
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
    fontFamily: fonts.semibold,
  },

  primaryButton: {
    width: "100%",
    height: 52,
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

  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(5, 46, 43, 0.08)",
  },

  dividerText: {
    color: MUTED,
    fontSize: 12,
    fontFamily: fonts.regular,
  },

  googleButton: {
    width: "100%",
    height: 52,
    borderRadius: 26,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(5, 46, 43, 0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 13,
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  googleIcon: {
    fontSize: 20,
    color: PRIMARY,
    fontFamily: fonts.bold,
  },

  googleText: {
    color: DARK,
    fontSize: 14,
    fontFamily: fonts.semibold,
  },

  fingerprint: {
    alignSelf: "center",
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  fingerprintText: {
    color: PRIMARY_DARK,
    fontSize: 13,
    fontFamily: fonts.semibold,
  },

  bold: {
    color: PRIMARY_DARK,
    fontFamily: fonts.bold,
  },

  footer: {
    marginTop: 18,
    fontSize: 13,
    textAlign: "center",
    color: DARK,
    fontFamily: fonts.regular,
  },

  link: {
    color: PRIMARY_DARK,
    fontFamily: fonts.bold,
  },
});