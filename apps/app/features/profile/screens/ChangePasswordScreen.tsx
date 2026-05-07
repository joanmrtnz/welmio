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
import FontAwesome from "@expo/vector-icons/FontAwesome";
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
            <Icon name="arrowLeft" size={22} color={TEXT} />
          </Pressable>
  
          <Text style={styles.title}>Change Password</Text>
  
          <Pressable style={styles.notifications}>
            <Icon name="bell" size={22} color={TEXT} />
          </Pressable>
        </View>

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardContent}
        >
          <View style={styles.heroIconWrap}>
            <View style={styles.heroIcon}>
              <FontAwesome name="key" size={36} color={PRIMARY} />
            </View>
          </View>

          <View style={styles.headingBlock}>
            <Text style={styles.sectionTitle}>Password Settings</Text>
            <Text style={styles.description}>
              Update your password regularly to keep your Welmio account protected.
            </Text>
          </View>

          <View style={styles.noticeCard}>
            <View style={styles.noticeIcon}>
              <Icon name="shield" size={22} strokeWidth={1.7} color={PRIMARY} />
            </View>
            <View style={styles.noticeTextWrap}>
              <Text style={styles.noticeTitle}>Use a strong password</Text>
              <Text style={styles.noticeText}>
                Mix letters, numbers and symbols for better security.
              </Text>
            </View>
          </View>

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

const BACKGROUND = "#dff7ef";
const PRIMARY = "#12c79b";
const PRIMARY_SOFT = "#e7fbf5";
const TEXT = "#052e2b";
const MUTED = "rgba(5, 46, 43, 0.58)";
const WHITE = "#ffffff";
const BORDER = "rgba(18, 199, 155, 0.14)";
const SHADOW = "rgba(29, 100, 89, 0.14)";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  headerArea: {
    height: 142,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 34,
  },

  title: {
    fontSize: 17,
    color: TEXT,
    fontFamily: fonts.bold,
  },

  notifications: {
    width: 42,
    height: 42,
    backgroundColor: WHITE,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(10, 58, 52, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  card: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
    shadowColor: SHADOW,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: -8 },
    elevation: 8,
  },

  cardContent: {
    paddingTop: 30,
    paddingBottom: 52,
  },

  heroIconWrap: {
    alignItems: "center",
    marginBottom: 18,
  },

  heroIcon: {
    width: 78,
    height: 78,
    borderRadius: 28,
    backgroundColor: PRIMARY_SOFT,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },

  headingBlock: {
    alignItems: "center",
    marginBottom: 22,
    paddingHorizontal: 8,
  },

  sectionTitle: {
    fontSize: 20,
    color: TEXT,
    fontFamily: fonts.bold,
    marginBottom: 8,
  },

  description: {
    fontSize: 13,
    color: MUTED,
    fontFamily: fonts.regular,
    lineHeight: 19,
    textAlign: "center",
  },

  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: PRIMARY_SOFT,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 24,
  },

  noticeIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },

  noticeTextWrap: {
    flex: 1,
  },

  noticeTitle: {
    fontSize: 13,
    color: TEXT,
    fontFamily: fonts.bold,
    marginBottom: 3,
  },

  noticeText: {
    fontSize: 11,
    color: MUTED,
    fontFamily: fonts.regular,
    lineHeight: 16,
  },

  form: {
    gap: 16,
  },

  buttons: {
    alignItems: "center",
    marginTop: 12,
  },
});
