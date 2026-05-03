import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { changePassword } from "../services/profile-service";


export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleChangePassword() {
    try {
      if (!currentPassword.trim() || !newPassword.trim() || !repeatPassword.trim()) {
        feedback.error("Please fill in all fields");
        return;
      }

      if (newPassword !== repeatPassword) {
        feedback.error("Passwords do not match");
        return;
      }

      setIsLoading(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      feedback.success("Password updated successfully");
      router.replace("/profile/settings");
    } catch (error) {
      console.warn(error);
      feedback.error("Error updating password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.headerArea}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrowLeft" size={22} color={BLACK} />
        </Pressable>

        <Text style={styles.title}>Change Password</Text>

        <Pressable style={styles.notifications}>
          <Icon name="bell" size={22} color={BLACK} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardContent}
        >
          <Text style={styles.sectionTitle}>Password Settings</Text>

          <Text style={styles.description}>
            Update your password to keep your account secure.
          </Text>

          <View style={styles.form}>
            <AuthInput
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
            />

            <AuthInput
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
            />

            <AuthInput
              label="Confirm Password"
              placeholder="Repeat new password"
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
            />

            <View style={styles.buttons}>
              <AuthButton
                title={isLoading ? "Updating..." : "Update Password"}
                onPress={handleChangePassword}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";
const BLACK = "#052e2b";
const WHITE = "#ffffff";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  headerArea: {
        height: 150,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingTop: 30,
   },
 
   title: {
       fontSize: 18, //18
       color: BLACK,
       fontFamily: fonts.bold,
       },
 
   notifications: {
       backgroundColor: WHITE,
       padding: 3,
       borderRadius: 100,
   },
 
  card: {
    flex: 1,
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    padding: 24,
  },

  cardContent: {
    paddingTop: 34,
    paddingBottom: 60,
  },

  sectionTitle: {
    fontSize: 20,
    color: BLACK,
    fontFamily: fonts.bold,
    marginBottom: 10,
  },

  description: {
    fontSize: 13,
    color: BLACK,
    opacity: 0.7,
    fontFamily: fonts.regular,
    marginBottom: 28,
    lineHeight: 19,
  },

  form: {
    gap: 16,
  },

  buttons: {
    alignItems: "center",
    marginTop: 8,
  },
});