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
import { Link, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { fonts } from "@/theme/fonts";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { toIsoDate } from "@/app/lib/date";
const WELMIO_LOGO = require("@/assets/images/welmio-logo-no-circle.png");

const BACKGROUND = "#dff7ef";
const CARD = "#ffffff";
const PRIMARY = "#00b889";
const PRIMARY_DARK = "#008f73";
const TEXT = "#073b3a";
const MUTED = "#6f8185";
const INPUT_BG = "#ffffff";
const INPUT_BORDER = "rgba(7, 59, 58, 0.12)";
const SOFT_MINT = "#dff7ef";

type SignupInputProps = {
  label: string;
  icon: keyof typeof FontAwesome.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numbers-and-punctuation";
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
        <FontAwesome name={icon} size={18} style={styles.inputIcon} color="rgba(7, 59, 58, 0.42)" />

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
      if (password !== confirmPassword) {
        console.warn("Las contraseñas no coinciden");
        return;
      }

      const formattedDateOfBirth = toIsoDate(dateOfBirth);

      if (!formattedDateOfBirth) {
        console.warn("Invalid date format");
        return;
      }

      const res = await execute({
        fullName,
        email,
        mobileNumber,
        dateOfBirth: formattedDateOfBirth,
        password,
      });

      if (res) {
        router.replace("/(app)/(tabs)/home");
      }
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandArea}>
          <View style={styles.brandRow}>
            <Image source={WELMIO_LOGO} style={styles.brandLogo} />
            <Text style={styles.brandName}>Welmio</Text>
          </View>
        </View>

        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Image source={WELMIO_LOGO} style={styles.heroLogo} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Start tracking your money, goals and habits in one place.
          </Text>

          <View style={styles.form}>
            <SignupInput
              label="Full Name"
              icon="user-o"
              placeholder="John Doe"
              autoCapitalize="words"
              textContentType="name"
              value={fullName}
              onChangeText={setFullName}
            />

            <SignupInput
              label="Email"
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

            <SignupInput
              label="Date of Birth"
              icon="calendar-o"
              placeholder="DD / MM / YYYY"
              keyboardType="numbers-and-punctuation"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />

            <SignupInput
              label="Password"
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
              label="Confirm Password"
              icon="lock"
              placeholder=""
              secureTextEntry
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword((current) => !current)
              }
              textContentType="newPassword"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <Text style={styles.legal}>
            By continuing, you agree to the{" "}
            <Link href="/(public)/terms-of-use" asChild>
              <Text style={styles.legalLink}>Terms of Use</Text>
            </Link>{" "}
            and{" "}
            <Link href="/(public)/privacy-policy" asChild>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </Link>
          </Text>

          <Pressable
            style={[styles.primaryButton, loading && styles.disabledButton]}
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

        <View style={styles.sloganCard}>
          <View style={styles.sloganIcon}>
            <FontAwesome name="lightbulb-o" size={23} color={PRIMARY} />
          </View>
          <View style={styles.sloganTextWrap}>
            <Text style={styles.sloganTitle}>Smart Finance, Simple Life</Text>
            <Text style={styles.sloganText}>Take control of your money with ease.</Text>
          </View>
        </View>
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

  brandArea: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 26,
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

  logoCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: SOFT_MINT,
    borderWidth: 4,
    borderColor: PRIMARY_DARK,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(7, 59, 58, 0.22)",
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  heroLogo: {
    width: 99,
    height: 98,
    resizeMode: "contain",
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

  title: {
    color: TEXT,
    fontSize: 24,
    textAlign: "center",
    fontFamily: fonts.bold,
  },

  subtitle: {
    marginTop: 10,
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    fontFamily: fonts.regular,
  },

  form: {
    marginTop: 26,
    gap: 14,
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

  sloganCard: {
    marginTop: 26,
    minHeight: 72,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 22,
    paddingVertical: 16,
    shadowColor: "rgba(7, 59, 58, 0.06)",
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },

  sloganIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: SOFT_MINT,
    alignItems: "center",
    justifyContent: "center",
  },

  sloganTextWrap: {
    flex: 1,
  },

  sloganTitle: {
    color: TEXT,
    fontSize: 13,
    fontFamily: fonts.bold,
  },

  sloganText: {
    marginTop: 4,
    color: MUTED,
    fontSize: 12,
    fontFamily: fonts.regular,
  },
});
