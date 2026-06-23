import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { Link, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "@/lib/i18n";
import { fonts } from "@/theme/fonts";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import { AppImage } from "@/components/images/AppImage";
import {
  canAccessNewPassword,
  getResetPasswordFlow,
  setResetPasswordChanged,
  type ResetPasswordFlowState,
} from "@/lib/auth/reset-password-flow-storage";
import { PublicAuthLanguageSelector } from "@/components/ui/public-auth-language-selector/PublicAuthLanguageSelector";

const WELMIO_LOGO = require("@/assets/images/welmio-logo.png");

const GREEN = "#dff7ef";
const PRIMARY = "#00b889";
const PRIMARY_DARK = "#079374";
const DARK = "#052e2b";
const MUTED = "#6f8586";
const CARD = "#ffffff";
const LIGHT_GRAY = "rgba(0, 0, 0, 0.2)";
const DESKTOP_BREAKPOINT = 768;
const DESKTOP_CONTENT_WIDTH = 1040;

export default function NewPasswordScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetFlow, setResetFlow] = useState<ResetPasswordFlowState | null>(null);
  const [isCheckingFlow, setIsCheckingFlow] = useState(true);

  const { execute, loading } = useResetPassword();

  useEffect(() => {
    let isMounted = true;

    async function hydrateResetFlow() {
      const flow = await getResetPasswordFlow();

      if (!canAccessNewPassword(flow)) {
        router.replace("/(public)/forgot-password");
        return;
      }

      if (isMounted) {
        setResetFlow(flow);
        setIsCheckingFlow(false);
      }
    }

    void hydrateResetFlow();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleChangePassword() {
    try {
      const resetCredential = resetFlow?.resetToken ?? resetFlow?.verificationCode;

      if (!resetFlow?.email || !resetCredential) {
        console.warn(t("auth.newPasswordScreen.errors.missingEmailOrCode"));
        router.replace("/(public)/forgot-password");
        return;
      }

      if (!newPassword || newPassword.length < 6) {
        console.warn(t("auth.newPasswordScreen.errors.passwordTooShort"));
        return;
      }

      if (newPassword !== confirmPassword) {
        console.warn(t("auth.newPasswordScreen.errors.passwordsDontMatch"));
        return;
      }

      const res = await execute(resetFlow.email, resetCredential, newPassword);

      if (res) {
        await setResetPasswordChanged();
        router.replace("/(public)/forgot-password/success");
      }
    } catch (error) {
      console.warn(error);
    }
  }

  if (isCheckingFlow) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={PRIMARY} />
      </View>
    );
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
        <View style={[styles.authLayout, isDesktop && styles.authLayoutDesktop]}>
          <View style={[styles.brandColumn, isDesktop && styles.brandColumnDesktop]}>
            <View style={[styles.brandArea, isDesktop && styles.brandAreaDesktop]}>
              <View style={styles.brandRow}>
                <View style={styles.logoBadge}>
                  <AppImage source={WELMIO_LOGO} style={styles.logoImage} />
                </View>

                <Text style={styles.brandName}>{t("common.appName")}</Text>
              </View>
            </View>

            {isDesktop ? (
              <View style={styles.desktopIntroCard}>
                <View style={styles.desktopIntroIcon}>
                  <FontAwesome name="shield" size={30} color={PRIMARY} />
                </View>

                <Text style={styles.desktopIntroTitle}>
                  {t("auth.newPasswordScreen.desktopTitle")}
                </Text>

                <Text style={styles.desktopIntroText}>
                  {t("auth.newPasswordScreen.desktopText")}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={[styles.formColumn, isDesktop && styles.formColumnDesktop]}>
            <View style={[styles.avatarWrap, isDesktop && styles.avatarWrapDesktop]}>
              <View style={styles.avatarCircle}>
                <FontAwesome name="shield" size={43} color={PRIMARY} />
              </View>
            </View>

            <View style={[styles.card, isDesktop && styles.cardDesktop]}>
              <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
                {t("auth.newPasswordScreen.title")}
              </Text>

              <Text style={[styles.subtitle, isDesktop && styles.subtitleDesktop]}>
                {t("auth.newPasswordScreen.subtitle")}
              </Text>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {t("auth.newPasswordScreen.newPassword")}
                  </Text>

                  <View style={styles.inputShell}>
                    <FontAwesome
                      name="lock"
                      size={17}
                      color="rgba(5, 46, 43, 0.5)"
                      style={styles.inputIcon}
                    />

                    <TextInput
                      style={styles.textInput}
                      placeholder={t("auth.newPasswordScreen.newPasswordPlaceholder")}
                      placeholderTextColor="rgba(5, 46, 43, 0.42)"
                      secureTextEntry={!showNewPassword}
                      textContentType="newPassword"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />

                    <Pressable
                      onPress={() => setShowNewPassword((value) => !value)}
                      hitSlop={8}
                      style={styles.eyeButton}
                      accessibilityLabel={
                        showNewPassword
                          ? t("auth.newPasswordScreen.hidePassword")
                          : t("auth.newPasswordScreen.showPassword")
                      }
                    >
                      <FontAwesome
                        name={showNewPassword ? "eye-slash" : "eye"}
                        size={17}
                        color="rgba(5, 46, 43, 0.45)"
                      />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {t("auth.newPasswordScreen.confirmNewPassword")}
                  </Text>

                  <View style={styles.inputShell}>
                    <FontAwesome
                      name="lock"
                      size={17}
                      color="rgba(5, 46, 43, 0.5)"
                      style={styles.inputIcon}
                    />

                    <TextInput
                      style={styles.textInput}
                      placeholder={t(
                        "auth.newPasswordScreen.confirmNewPasswordPlaceholder",
                      )}
                      placeholderTextColor="rgba(5, 46, 43, 0.42)"
                      secureTextEntry={!showConfirmPassword}
                      textContentType="newPassword"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />

                    <Pressable
                      onPress={() => setShowConfirmPassword((value) => !value)}
                      hitSlop={8}
                      style={styles.eyeButton}
                      accessibilityLabel={
                        showConfirmPassword
                          ? t("auth.newPasswordScreen.hidePassword")
                          : t("auth.newPasswordScreen.showPassword")
                      }
                    >
                      <FontAwesome
                        name={showConfirmPassword ? "eye-slash" : "eye"}
                        size={17}
                        color="rgba(5, 46, 43, 0.45)"
                      />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Pressable
                    onPress={handleChangePassword}
                    disabled={loading}
                    style={({ pressed }) => [
                      styles.primaryButton,
                      pressed && !loading ? styles.buttonPressed : null,
                      loading ? styles.buttonDisabled : null,
                    ]}
                  >
                    <Text style={styles.primaryButtonText}>
                      {loading
                        ? t("auth.newPasswordScreen.updating")
                        : t("auth.newPasswordScreen.changePassword")}
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
                  <Text style={styles.ghostButtonText}>
                    {t("auth.newPasswordScreen.backToLogin")}
                  </Text>
                </Pressable>

                <Link href="/(public)/signup" style={styles.footer}>
                  <Text>
                    {t("auth.newPasswordScreen.noAccount")}{" "}
                    <Text style={styles.link}>
                      {t("auth.newPasswordScreen.signUp")}
                    </Text>
                  </Text>
                </Link>

                <PublicAuthLanguageSelector />
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GREEN,
  },

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

  authLayout: {
    width: "100%",
  },

  authLayoutDesktop: {
    maxWidth: DESKTOP_CONTENT_WIDTH,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 56,
  },

  brandColumn: {},

  brandColumnDesktop: {
    flex: 1,
  },

  formColumn: {},

  formColumnDesktop: {
    width: 460,
  },

  brandArea: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 42,
  },

  brandAreaDesktop: {
    alignItems: "flex-start",
    marginTop: 0,
    marginBottom: 28,
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

  avatarWrapDesktop: {
    marginBottom: -40,
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
    paddingHorizontal: 34,
    paddingBottom: 34,
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
    paddingHorizontal: 8,
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
    paddingRight: 12,
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
    fontFamily: fonts.medium,
    paddingVertical: 0,
  },

  eyeButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
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

  desktopIntroCard: {
    maxWidth: 470,
    borderRadius: 34,
    backgroundColor: "rgba(255, 255, 255, 0.58)",
    borderWidth: 1,
    borderColor: "rgba(5, 46, 43, 0.08)",
    padding: 32,
    shadowColor: "rgba(29, 100, 89, 0.1)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },

  desktopIntroIcon: {
    width: 68,
    height: 68,
    borderRadius: 24,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  desktopIntroTitle: {
    color: DARK,
    fontSize: 34,
    lineHeight: 40,
    fontFamily: fonts.bold,
    marginBottom: 12,
  },

  desktopIntroText: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 26,
    fontFamily: fonts.medium,
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 115,
  },
});