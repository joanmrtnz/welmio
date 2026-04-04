import { View, Text, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import { fonts } from "@/theme/fonts";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useState } from "react";

export default function LoginScreen() {

  const { execute, loading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {

    try {
      const res = await execute(
      {
        email,
        password,
      });

      if (res) router.replace("/(app)/(tabs)/home");
    } catch (error){
      console.warn(error);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Text style={styles.welcome}>Welcome</Text>
      </View>


      <View style={styles.card}>
    
        <View style={styles.form}>
          <AuthInput
            label="Username or Email"
            placeholder="example@email.com"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <AuthInput
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.buttons}>
            <AuthButton
              title="Log In"
              onPress={handleLogin} 
              disabled={loading}
            />

            <Link href="/(public)/forgot-password" style={styles.link}>
                <Text>Forgot Password?</Text>
            </Link>

            <AuthButton
              title="Sign Up"
              variant="secondary"
              onPress={() => {
                router.push("/(public)/signup");
              }}
            />
          </View>

          <Link href="/(public)/finger-print" style={styles.fingerprint}>
            <Text >
              Use <Text style={styles.bold}>Fingerprint</Text> To Access
            </Text>
          </Link>

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

const GREEN = "#00c896";
const DARK_GREEN = "#059669"
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
    marginTop: 74,
    gap: 16,
  },

  link: {
    color: DARK_GREEN,
    fontSize: 11,
    textAlign: "center",
    fontFamily: fonts.semibold,
  },
  buttons:{
    marginTop: 64,
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    fontFamily: fonts.medium,
  },
  fingerprint: {
    textAlign: "center",  
    marginTop: 12,
    fontSize: 12,
    fontFamily: fonts.medium,
  },

  bold: {
    color: DARK_GREEN,
    fontFamily: fonts.bold,
  },

  divider: {
    textAlign: "center",
    color: "#052e2b",
    marginTop: 15,
    fontSize: 11,
    fontFamily: fonts.regular,
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
  },

  footer: {
    fontSize: 11,
    textAlign: "center",
    color: "#052e2b",
    fontFamily: fonts.regular,
  },
});
