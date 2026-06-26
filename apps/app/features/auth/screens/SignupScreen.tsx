import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { ExternalPathString, Link, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { fonts } from "@/theme/fonts";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { DateInput } from "@/components/ui/date-input/dateInput";
import { toIsoDate } from "@/lib/date";
import { AppImage } from "@/components/images/AppImage";
import { PublicAuthLanguageSelector } from "@/components/ui/public-auth-language-selector/PublicAuthLanguageSelector";
import { useTranslation } from "@/lib/i18n/useTranslation";

const WELMIO_LOGO = require("@/assets/images/welmio-logo.png");
const WELMIO_AVATAR_BASE = require("@/assets/images/welmio-avatar-base.png");
const rawWelmioAppUrl = process.env.EXPO_PUBLIC_WELMIO_APP_URL?.trim();
const WELMIO_APP_URL = rawWelmioAppUrl
  ? rawWelmioAppUrl.replace(/\/+$/, "")
  : "https://welmio.dev";

const WELMIO_TERMS_URL = `${WELMIO_APP_URL}/terms` as ExternalPathString;
const WELMIO_PRIVACY_URL = `${WELMIO_APP_URL}/privacy` as ExternalPathString;
const GREEN = "#dff7ef";
const CARD = "#ffffff";
const PRIMARY = "#00b889";
const DARK_GREEN = "#008f73";
const TEXT = "#073b3a";
const MUTED = "#6f8185";
const INPUT_BG = "#ffffff";
const INPUT_BORDER = "rgba(7, 59, 58, 0.12)";
const DESKTOP_BREAKPOINT = 768;
const DESKTOP_CONTENT_WIDTH = 1040;

type SignupInputProps = {
  label: string;
  icon: keyof typeof FontAwesome.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  keyboardType?:
    | "default"
    | "email-address"
    | "phone-pad"
    | "numbers-and-punctuation";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  textContentType?:
    | "none"
    | "name"
    | "emailAddress"
    | "telephoneNumber"
    | "newPassword";
  autoCorrect?: boolean;
};

function SignupInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  showPassword,
  onTogglePassword,
  keyboardType = "default",
  autoCapitalize = "sentences",
  textContentType = "none",
  autoCorrect = true,
}: SignupInputProps) {
  const isPassword = Boolean(onTogglePassword);
  const { t } = useTranslation();

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      <View style={styles.inputShell}>
        <FontAwesome
          name={icon}
          size={18}
          style={styles.inputIcon}
          color="rgba(7, 59, 58, 0.42)"
        />

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(7, 59, 58, 0.42)"
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          autoCorrect={autoCorrect}
        />

        {isPassword ? (
          <Pressable
            hitSlop={10}
            onPress={onTogglePassword}
            style={styles.eyeButton}
            accessibilityLabel={
              showPassword
                ? t("auth.signup.hidePassword")
                : t("auth.signup.showPassword")
            }
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={17}
              color="rgba(7, 59, 58, 0.55)"
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default function SignupScreen() {
  const { execute, loading } = useSignup();
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();

  async function handleSignup() {
    try {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        feedback.error(t("auth.signup.errors.requiredFields"));
        return;
      }

      if (password !== confirmPassword) {
        feedback.error(t("auth.signup.errors.passwordsDontMatch"));
        return;
      }

      const formattedDateOfBirth = toIsoDate(dateOfBirth);

      const res = await execute({
        fullName,
        email,
        mobileNumber: mobileNumber.trim() || undefined,
        dateOfBirth: formattedDateOfBirth || undefined,
        password,
      });

      if (res) {
        router.replace("/(public)/login");
      }
    } catch (error) {
      console.warn(error);
    }
  }

  const brandHeader = (
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
  );

  const logoHero = (
    <View style={[styles.logoWrap, isDesktop && styles.logoWrapDesktop]}>
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
  );

  const signupCard = (
    <View style={[styles.card, isDesktop && styles.cardDesktop]}>
      <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
        {t("auth.signup.title")}
      </Text>

      <Text style={[styles.subtitle, isDesktop && styles.subtitleDesktop]}>
        {t("auth.signup.subtitle")}
      </Text>

      <View style={[styles.form, isDesktop && styles.formDesktop]}>
        <SignupInput
          label={t("auth.signup.fullNameRequired")}
          icon="user-o"
          placeholder={t("auth.signup.fullNamePlaceholder")}
          autoCapitalize="words"
          textContentType="name"
          value={fullName}
          onChangeText={setFullName}
        />

        <SignupInput
          label={t("auth.signup.emailRequired")}
          icon="envelope-o"
          placeholder={t("auth.signup.emailPlaceholder")}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <SignupInput
          label={t("auth.signup.mobileNumber")}
          icon="phone"
          placeholder={t("auth.signup.mobileNumberPlaceholder")}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />

        <DateInput
          label={t("auth.signup.dateOfBirth")}
          icon="calendar-o"
          placeholder={t("auth.signup.dateOfBirthPlaceholder")}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        />

        <SignupInput
          label={t("auth.signup.passwordRequired")}
          icon="lock"
          placeholder={t("auth.signup.passwordPlaceholder")}
          secureTextEntry
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((current) => !current)}
          textContentType="newPassword"
          value={password}
          onChangeText={setPassword}
        />

        <SignupInput
          label={t("auth.signup.confirmPasswordRequired")}
          icon="lock"
          placeholder={t("auth.signup.confirmPasswordPlaceholder")}
          secureTextEntry
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword((current) => !current)}
          textContentType="newPassword"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <Text style={styles.legal}>
        {t("auth.signup.legal.prefix")}{" "}
        <Link href={WELMIO_TERMS_URL} asChild>
          <Text style={styles.legalLink}>
            {t("auth.signup.legal.terms")}
          </Text>
        </Link>{" "}
        {t("auth.signup.legal.and")}{" "}
        <Link href={WELMIO_PRIVACY_URL} asChild>
          <Text style={styles.legalLink}>
            {t("auth.signup.legal.privacy")}
          </Text>
        </Link>
      </Text>

      <Pressable
        style={[
          styles.primaryButton,
          isDesktop && styles.primaryButtonDesktop,
          loading && styles.disabledButton,
        ]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? t("auth.signup.creatingAccount") : t("auth.signup.submit")}
        </Text>
      </Pressable>

      <Link href="/(public)/login" style={styles.footer}>
        <Text>
          {t("auth.signup.alreadyHaveAccount")}{" "}
          <Text style={styles.link}>{t("auth.signup.logIn")}</Text>
        </Text>
      </Link>

      <PublicAuthLanguageSelector />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {isDesktop ? (
          <View style={styles.desktopShell}>
            <View style={styles.desktopHeroPane}>
              {brandHeader}
              <View style={styles.desktopLogoBlock}>{logoHero}</View>
              <View style={styles.desktopDescriptionBlock}>
                <Text style={styles.desktopHeadline}>
                  {t("auth.signup.desktopHeadline")}
                </Text>

                <Text style={styles.desktopCopy}>
                  {t("auth.signup.desktopCopy")}
                </Text>
              </View>
            </View>

            <View style={styles.desktopFormPane}>{signupCard}</View>
          </View>
        ) : (
          <>
            {brandHeader}
            {logoHero}
            {signupCard}
          </>
        )}
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
    paddingTop: 28,
    paddingBottom: 28,
  },

  scrollContentDesktop: {
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  desktopShell: {
    width: "100%",
    maxWidth: DESKTOP_CONTENT_WIDTH,
    minHeight: 680,
    flexDirection: "row",
    alignItems: "center",
    gap: 44,
  },

  desktopHeroPane: {
    flex: 1,
    minWidth: 0,
    alignSelf: "stretch",
    justifyContent: "center",
  },

  desktopFormPane: {
    flex: 1.08,
    minWidth: 0,
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
    color: TEXT,
    fontFamily: fonts.bold,
  },

  brandNameDesktop: {
    fontSize: 30,
  },

  logoWrap: {
    alignItems: "center",
    marginBottom: -42,
    zIndex: 2,
  },

  logoWrapDesktop: {
    alignItems: "center",
    marginBottom: 0,
  },

  desktopLogoBlock: {
    marginBottom: 28,
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

  desktopDescriptionBlock: {
    alignItems: "center",
  },

  desktopHeadline: {
    maxWidth: 420,
    color: TEXT,
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -1,
    textAlign: "center",
    fontFamily: fonts.bold,
  },

  desktopCopy: {
    maxWidth: 440,
    marginTop: 16,
    color: MUTED,
    fontSize: 16,
    lineHeight: 25,
    fontFamily: fonts.regular,
    textAlign: "center",
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 68,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(7, 59, 58, 0.06)",
    shadowColor: "rgba(7, 59, 58, 0.09)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },

  cardDesktop: {
    paddingHorizontal: 34,
    paddingTop: 34,
    paddingBottom: 34,
    borderRadius: 32,
  },

  title: {
    color: TEXT,
    fontSize: 24,
    textAlign: "center",
    fontFamily: fonts.bold,
  },

  titleDesktop: {
    textAlign: "left",
    fontSize: 30,
  },

  subtitle: {
    marginTop: 10,
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    fontFamily: fonts.regular,
  },

  subtitleDesktop: {
    textAlign: "left",
    fontSize: 15,
    lineHeight: 23,
  },

  form: {
    marginTop: 26,
    gap: 14,
  },

  formDesktop: {
    gap: 16,
  },

  inputGroup: {
    gap: 8,
  },

  inputLabel: {
    color: TEXT,
    fontSize: 13,
    fontFamily: fonts.semibold,
  },

  inputShell: {
    height: 49,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: INPUT_BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    minWidth: 0,
    color: TEXT,
    fontSize: 14,
    fontFamily: fonts.regular,
    paddingVertical: 0,
  },

  inputIcon: {
    width: 23,
    borderRightColor: "rgba(5, 46, 43, 0.12)",
    borderRightWidth: 1.5,
    marginRight: 5,
  },

  eyeButton: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  legal: {
    alignSelf: "center",
    marginTop: 20,
    maxWidth: 290,
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    fontFamily: fonts.regular,
  },

  legalLink: {
    color: DARK_GREEN,
    fontFamily: fonts.semibold,
  },

  primaryButton: {
    height: 52,
    width: "100%",
    marginTop: 24,
    borderRadius: 26,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 184, 137, 0.28)",
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  disabledButton: {
    opacity: 0.7,
  },

  primaryButtonDesktop: {
    alignSelf: "center",
    width: 220,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: fonts.bold,
  },

  footer: {
    marginTop: 22,
    color: TEXT,
    fontSize: 13,
    textAlign: "center",
    fontFamily: fonts.regular,
  },

  link: {
    color: DARK_GREEN,
    fontFamily: fonts.bold,
  },
});