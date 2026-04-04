import { View, Text, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import { fonts } from "@/theme/fonts";
import { useState } from "react";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { toIsoDate } from "@/app/lib/date";


export default function SignupScreen() {
  const { execute, loading } = useSignup();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Text style={styles.welcome}>Create Account</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.form}>
          <AuthInput
            label="Full Name"
            placeholder="John Doe"
            autoCapitalize="words"
            textContentType="name"
            value={fullName}
            onChangeText={setFullName}
          />

          <AuthInput
            label="Email"
            placeholder="example@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <AuthInput
            label="Mobile Number"
            placeholder="+123 456 789"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />

          <AuthInput
            label="Date of Birth"
            placeholder="DD / MM / YYYY"
            keyboardType="numbers-and-punctuation"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />

          <AuthInput
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            textContentType="newPassword"
            value={password}
            onChangeText={setPassword}
          />

          <AuthInput
            label="Confirm Password"
            placeholder="••••••••"
            secureTextEntry
            textContentType="newPassword"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.legalContainer}>
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
          </View>

          <View style={styles.buttons}>
            <AuthButton
              title="Sign up"
              onPress={handleSignup}
              disabled={loading}
            />
          </View>

          <Link href="/(public)/login" style={styles.footer}>
            <Text>
              Already have an account?{" "}
              <Text style={styles.link}>Log in</Text>
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
}


const GREEN = "#00c896";
const DARK_GREEN = "#059669";
const LIGHT_GREEN = "#f1fff3";

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
    marginTop: 55,
    gap: 16,
  },

  buttons: {
    alignItems: "center",
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
  legalContainer: {
    alignItems: "center",
  },
  legal: {
    marginTop: 40,
    width: 250,
    fontSize: 11,
    textAlign: "center",
    color: "#052e2b",
    fontFamily: fonts.regular,
    lineHeight: 16,
    },
    legalLink: {
        color: DARK_GREEN,
        fontFamily: fonts.semibold,
    },
});

