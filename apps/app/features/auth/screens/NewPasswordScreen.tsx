import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import { fonts } from "@/theme/fonts";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";

export default function NewPasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { email, code } = useLocalSearchParams<{
    email?: string;
    code?: string;
  }>();

  const { execute, loading } = useResetPassword();

  async function handleChangePassword() {
    try {
      if (!email || !code) {
        console.warn("Missing email or code");
        return;
      }

      if (!newPassword || newPassword.length < 6) {
        console.warn("Password must be at least 6 characters");
        return;
      }

      if (newPassword !== confirmPassword) {
        console.warn("Passwords do not match");
        return;
      }

      const res = await execute(email, code, newPassword);

      if (res) {
        router.replace("/(public)/forgot-password/success");
      }
    } catch (error) {
      console.warn(error);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Text style={styles.welcome}>New Password</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.form}>
          <AuthInput
            label="New Password"
            placeholder="••••••••"
            secureTextEntry
            textContentType="newPassword"
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <AuthInput
            label="Confirm New Password"
            placeholder="••••••••"
            secureTextEntry
            textContentType="newPassword"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.buttons}>
            <AuthButton
              title="Change Password"
              onPress={handleChangePassword}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

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
    marginTop: 80,
    gap: 24,
  },

  buttons: {
    alignItems: "center",
    marginTop: 40,
  },
});
