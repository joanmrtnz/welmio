import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import { fonts } from "@/theme/fonts";


export default function SignupScreen() {
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
        />

        <AuthInput
            label="Email"
            placeholder="example@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCorrect={false}
        />

        <AuthInput
            label="Mobile Number"
            placeholder="+123 456 789"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
        />

        <AuthInput
            label="Date of Birth"
            placeholder="DD / MM / YYYY"
            keyboardType="numbers-and-punctuation"
        />

        <AuthInput
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            textContentType="newPassword"
        />

        <AuthInput
            label="Confirm Password"
            placeholder="••••••••"
            secureTextEntry
            textContentType="newPassword"
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
            <AuthButton title="Sign up" />
        </View>

        <Link 
        href="/(public)/login" 
        style={styles.footer}>
            <Text >
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
    height: 130,
    justifyContent: "center",
    alignItems: "center",
  },

  welcome: {
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

