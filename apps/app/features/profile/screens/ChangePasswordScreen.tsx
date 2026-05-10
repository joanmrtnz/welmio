import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { changePassword } from "../services/profile-service";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";

export default function ChangePasswordScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleChangePassword() {
    try {
      if (
        !currentPassword.trim() ||
        !newPassword.trim() ||
        !repeatPassword.trim()
      ) {
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

  const renderPasswordField = ({
    label,
    value,
    onChangeText,
    placeholder,
    textContentType,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    textContentType: "password" | "newPassword";
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={MUTED}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType={textContentType}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppScreenHeader title="Change Password" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          isDesktop && styles.contentDesktop,
        ]}
      >
        <View style={[styles.mobileStack, isDesktop && styles.desktopGrid]}>
          <View
            style={[styles.mobileStack, isDesktop && styles.desktopLeftColumn]}
          >
            <View
              style={[
                styles.securityCard,
                isDesktop && styles.securityCardDesktop,
              ]}
            >
              <View style={styles.heroIconWrap}>
                <View style={styles.heroIcon}>
                  <FontAwesome name="key" size={36} color={TEAL} />
                </View>
              </View>

              <View style={styles.headingBlock}>
                <Text style={styles.sectionTitle}>Password Settings</Text>
                <Text style={styles.description}>
                  Update your password regularly to keep your Welmio account
                  protected.
                </Text>
              </View>
            </View>

            <View
              style={[styles.noticeCard, isDesktop && styles.noticeCardDesktop]}
            >
              <View style={styles.noticeIcon}>
                <Icon name="shield" size={22} strokeWidth={1.7} color={TEAL} />
              </View>
              <View style={styles.noticeTextWrap}>
                <Text style={styles.noticeTitle}>Use a strong password</Text>
                <Text style={styles.noticeText}>
                  Mix letters, numbers and symbols for better security.
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.formCard, isDesktop && styles.formCardDesktop]}>
            <Text style={styles.formTitle}>Update password</Text>

            <View style={styles.form}>
              {renderPasswordField({
                label: "Current Password",
                placeholder: "Enter current password",
                value: currentPassword,
                onChangeText: setCurrentPassword,
                textContentType: "password",
              })}

              {renderPasswordField({
                label: "New Password",
                placeholder: "Enter new password",
                value: newPassword,
                onChangeText: setNewPassword,
                textContentType: "newPassword",
              })}

              {renderPasswordField({
                label: "Confirm Password",
                placeholder: "Repeat new password",
                value: repeatPassword,
                onChangeText: setRepeatPassword,
                textContentType: "newPassword",
              })}

              <Pressable
                style={({ pressed }) => [
                  styles.updateButton,
                  isDesktop && styles.updateButtonDesktop,
                  pressed && styles.updateButtonPressed,
                  isLoading && styles.updateButtonDisabled,
                ]}
                onPress={handleChangePassword}
                disabled={isLoading}
              >
                <Text style={styles.updateButtonText}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const TEAL = "#00c896";
const DARK_TEAL = "#063b3a";
const SOFT_TEAL = "#a9efdf";
const VERY_SOFT_TEAL = "#dff7ef";
const CARD = "#fbfffd";
const WHITE = "#ffffff";
const MUTED = "#5e7b78";
const INPUT_BG = "#eef8f2";
const GRID = "rgba(6, 59, 58, 0.09)";
const DESKTOP_CONTENT_WIDTH = 1040;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: VERY_SOFT_TEAL,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 118,
  },

  contentDesktop: {
    width: "100%",
    maxWidth: DESKTOP_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingBottom: 150,
  },

  mobileStack: {
    width: "100%",
  },

  desktopGrid: {
    width: "100%",
    flexDirection: "row",
    gap: 24,
    alignItems: "flex-start",
  },

  desktopLeftColumn: {
    flex: 0.9,
    gap: 18,
  },

  securityCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 24,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  securityCardDesktop: {
    minHeight: 252,
    justifyContent: "center",
    marginBottom: 0,
    paddingHorizontal: 28,
    paddingVertical: 30,
  },

  heroIconWrap: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: SOFT_TEAL,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  heroIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },

  headingBlock: {
    alignItems: "center",
    paddingHorizontal: 8,
  },

  sectionTitle: {
    fontSize: 21,
    lineHeight: 27,
    color: DARK_TEAL,
    fontFamily: fonts.bold,
    marginBottom: 8,
    textAlign: "center",
  },

  description: {
    fontSize: 13,
    color: MUTED,
    fontFamily: fonts.medium,
    lineHeight: 19,
    textAlign: "center",
  },

  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: CARD,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  noticeCardDesktop: {
    marginBottom: 0,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  noticeIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: VERY_SOFT_TEAL,
    alignItems: "center",
    justifyContent: "center",
  },

  noticeTextWrap: {
    flex: 1,
  },

  noticeTitle: {
    fontSize: 14,
    color: DARK_TEAL,
    fontFamily: fonts.bold,
    marginBottom: 3,
  },

  noticeText: {
    fontSize: 12,
    color: MUTED,
    fontFamily: fonts.regular,
    lineHeight: 17,
  },

  formCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  formCardDesktop: {
    flex: 1.15,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },

  formTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
    marginBottom: 16,
  },

  form: {
    gap: 16,
  },

  inputGroup: {
    gap: 9,
  },

  inputLabel: {
    fontSize: 13,
    color: DARK_TEAL,
    fontFamily: fonts.bold,
    paddingHorizontal: 2,
  },

  inputBox: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: INPUT_BG,
    flexDirection: "row",
    alignItems: "center",
  },

  inputIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(18, 184, 149, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  input: {
    flex: 1,
    minWidth: 0,
    height: 52,
    color: DARK_TEAL,
    fontSize: 14,
    fontFamily: fonts.medium,
    paddingVertical: 0,
    paddingHorizontal: 20,
  },

  updateButton: {
    alignSelf: "center",
    width: 214,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#c9f3df",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "rgba(29, 100, 89, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  updateButtonPressed: {
    opacity: 0.82,
  },

  updateButtonDisabled: {
    opacity: 0.7,
  },

  updateButtonDesktop: {
    alignSelf: "center",
    width: 220,
    marginTop: 16,
  },

  updateButtonText: {
    color: DARK_TEAL,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});
