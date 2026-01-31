import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import { fonts } from "@/theme/fonts";

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";

export default function NewPasswordScreen() {
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
          />

          <AuthInput
            label="Confirm New Password"
            placeholder="••••••••"
            secureTextEntry
            textContentType="newPassword"
          />

          <View style={styles.buttons}>
            <AuthButton
              title="Change Password"
              onPress={() => {
                router.replace("/(public)/forgot-password/success");
              }}
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
