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
  useWindowDimensions,
} from "react-native";
import { ExternalPathString, Link, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { fonts } from "@/theme/fonts";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { DateOfBirthInput } from "@/components/ui/date-of-birth-input/dateOfBirthInput";
import { toIsoDate } from "@/lib/date";

const WELMIO_LOGO = require("@/assets/images/welmio-logo.png");
const WELMIO_APP_URL =
  process.env.EXPO_PUBLIC_WELMIO_APP_URL ?? "https://welmio.dev";

const WELMIO_TERMS_URL = `${WELMIO_APP_URL}/terms` as ExternalPathString;
const WELMIO_PRIVACY_URL = `${WELMIO_APP_URL}/privacy` as ExternalPathString;
const BACKGROUND = "#dff7ef";
const CARD = "#ffffff";
const PRIMARY = "#00b889";
const PRIMARY_DARK = "#008f73";
const TEXT = "#073b3a";
const MUTED = "#6f8185";
const INPUT_BG = "#ffffff";
const INPUT_BORDER = "rgba(7, 59, 58, 0.12)";
const SOFT_MINT = "#dff7ef";
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

 async function handleSignup() {
  try {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      feedback.error("Fill the required form fields before submitting");
      return;
    }

    if (password !== confirmPassword) {
      feedback.error("The passwords don't match");
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
        <Image source={WELMIO_LOGO} style={styles.brandLogo} />
        <Text style={styles.brandName}>Welmio</Text>
      </View>
    </View>
  );

  const logoHero = (
    <View style={[styles.logoWrap, isDesktop && styles.logoWrapDesktop]}>
      <View style={[styles.logoCircle, isDesktop && styles.logoCircleDesktop]}>
        <Image
          source={WELMIO_LOGO}
          style={[styles.heroLogo, isDesktop && styles.heroLogoDesktop]}
        />
      </View>
    </View>
  );

  const signupCard = (
    <View style={[styles.card, isDesktop && styles.cardDesktop]}>
      <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
        Create account
      </Text>
      <Text style={[styles.subtitle, isDesktop && styles.subtitleDesktop]}>
        Start tracking your money, goals and habits in one place.
      </Text>

      <View style={[styles.form, isDesktop && styles.formDesktop]}>
        <SignupInput
          label="Full Name *"
          icon="user-o"
          placeholder="John Doe"
          autoCapitalize="words"
          textContentType="name"
          value={fullName}
          onChangeText={setFullName}
        />

        <SignupInput
          label="Email *"
          icon="envelope-o"
          placeholder="example@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <SignupInput
          label="Mobile Number"
          icon="phone"
          placeholder="+123 456 789"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />

        <DateOfBirthInput
          label="Date of Birth"
          icon="calendar-o"
          placeholder="DD / MM / YYYY"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
        />

        <SignupInput
          label="Password *"
          icon="lock"
          placeholder=""
          secureTextEntry
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((current) => !current)}
          textContentType="newPassword"
          value={password}
          onChangeText={setPassword}
        />

        <SignupInput
          label="Confirm Password *"
          icon="lock"
          placeholder=""
          secureTextEntry
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword((current) => !current)}
          textContentType="newPassword"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <Text style={styles.legal}>
        By continuing, you agree to the{" "}
        <Link href={WELMIO_TERMS_URL} asChild>
          <Text style={styles.legalLink}>Terms of Use</Text>
        </Link>{" "}
        and{" "}
        <Link href={WELMIO_PRIVACY_URL} asChild>
          <Text style={styles.legalLink}>Privacy Policy</Text>
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
          {loading ? "Creating account..." : "Sign Up"}
        </Text>
      </Pressable>

      <Link href="/(public)/login" style={styles.footer}>
        <Text>
          Already have an account? <Text style={styles.link}>Log in</Text>
        </Text>
      </Link>
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
              <Text style={styles.desktopHeadline}>
                Build better money habits from day one.
              </Text>
              <Text style={styles.desktopCopy}>
                Create your Welmio account and start organizing expenses,
                savings goals, and financial routines with a clean dashboard.
              </Text>
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
    backgroundColor: BACKGROUND,
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
    marginBottom: 26,
  },

  brandAreaDesktop: {
    alignItems: "flex-start",
    marginTop: 0,
    marginBottom: 30,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  brandLogo: {
    width: 34,
    height: 34,
    resizeMode: "contain",
  },

  brandName: {
    color: TEXT,
    fontSize: 25,
    letterSpacing: 1,
    fontFamily: fonts.bold,
  },

  logoWrap: {
    alignItems: "center",
    marginBottom: -42,
    zIndex: 2,
  },

  logoWrapDesktop: {
    alignItems: "flex-start",
    marginBottom: 0,
  },

  desktopLogoBlock: {
    marginBottom: 28,
  },

  logoCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: SOFT_MINT,
    borderWidth: 4,
    borderColor: PRIMARY_DARK,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "rgba(7, 59, 58, 0.22)",
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  heroLogo: {
    width: "92%",
    height: "92%",
    resizeMode: "contain",
  },

  logoCircleDesktop: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },

  heroLogoDesktop: {
    width: "93%",
    height: "93%",
  },

  desktopHeadline: {
    maxWidth: 420,
    color: TEXT,
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -1,
    fontFamily: fonts.bold,
  },

  desktopCopy: {
    maxWidth: 440,
    marginTop: 16,
    color: MUTED,
    fontSize: 16,
    lineHeight: 25,
    fontFamily: fonts.regular,
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
    color: PRIMARY_DARK,
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
    color: PRIMARY_DARK,
    fontFamily: fonts.bold,
  },

});
