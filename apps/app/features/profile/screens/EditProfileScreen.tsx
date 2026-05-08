import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { getUserProfile, updateUserProfile } from "../services/profile-service";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { router } from "expo-router";
import { AvatarPickerModal } from "../components/AvatarPickerModal";
import { IconName } from "@repo/shared-types";
import { Image } from "react-native";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";


export default function EditProfileScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const [usernameLabel, setUsernameLabel] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarIcon, setAvatarIcon] = useState<IconName>("user");
  const [avatarColor, setAvatarColor] = useState(GREEN);
  const WELMIO_LOGO = require("@/assets/images/welmio-logo-no-circle.png");


  async function handleUpdateProfile() {
    try {
      setIsLoading(true);

      const updatedUser = await updateUserProfile({
        fullName: username.trim(),
        mobileNumber: phone.trim() || null,
        avatarIcon,
        avatarColor,
      });

      setUsername(updatedUser.fullName ?? "");
      setUsernameLabel(updatedUser.fullName ?? "");
      setPhone(updatedUser.mobileNumber ?? "");
      setEmail(updatedUser.email ?? "");
      setUserId(updatedUser.id);
      setAvatarIcon(updatedUser.avatarIcon ?? "user");
      setAvatarColor(updatedUser.avatarColor ?? "#00c896");

      feedback.success("Profile updated successfully");
    } catch (error) {
      console.warn(error);
      feedback.error("Error updating profile");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setIsLoading(true);

        const user = await getUserProfile();

        setUsername(user.fullName ?? "");
        setUsernameLabel(user.fullName ?? "");
        setPhone(user.mobileNumber ?? "");
        setEmail(user.email ?? "");
        setUserId(user.id);
        setAvatarColor(user.avatarColor ?? GREEN);
        setAvatarIcon(user.avatarIcon ?? "user");
      } catch (error) {
        console.error("Error loading user profile", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  const renderField = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    editable = true,
    keyboardType = "default",
    textContentType,
    autoCapitalize = "sentences",
    autoCorrect = true,
  }: {
    label: string;
    icon: IconName;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    editable?: boolean;
    keyboardType?: "default" | "email-address" | "phone-pad";
    textContentType?: "name" | "telephoneNumber" | "emailAddress";
    autoCapitalize?: "none" | "sentences" | "words";
    autoCorrect?: boolean;
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputBox, !editable && styles.inputBoxDisabled]}>
        <View style={styles.inputIconBox}>
          <Icon name={icon} size={19} strokeWidth={1.8} color={TEAL} />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={MUTED}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          textContentType={textContentType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppScreenHeader title="Edit My Profile" />
  
      <ScrollView
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.desktopLayoutMobile, isDesktop && styles.desktopLayout]}>
          <View style={[styles.profileCard, isDesktop && styles.profileCardDesktop]}>
            <View style={styles.avatarOuterRing}>
              <View
                style={[
                  styles.avatar,
                  { borderColor: avatarColor || TEAL, backgroundColor: avatarColor || SOFT_TEAL },
                ]}
              >
                <Image
                  source={WELMIO_LOGO}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              <Pressable
                style={styles.editAvatarButton}
                onPress={() => setShowAvatarModal(true)}
              >
                <Icon name="edit" size={17} strokeWidth={1.9} color={DARK_TEAL} />
              </Pressable>
            </View>

            <View style={styles.nameContainer}>
              <Text style={styles.name}>{usernameLabel || "User"}</Text>
              <Text style={styles.userId}>{email ? email : "-"}</Text>
            </View>
          </View>

          <View style={[styles.settingsColumn, isDesktop && styles.settingsColumnDesktop]}>
            <View style={[styles.settingsCard, isDesktop && styles.settingsCardDesktop]}>
              <View style={styles.form}>
                {renderField({
                  label: "Username",
                  icon: "user",
                  placeholder: "John Smith",
                  autoCapitalize: "words",
                  textContentType: "name",
                  value: username,
                  onChangeText: setUsername,
                })}

                {renderField({
                  label: "Phone",
                  icon: "phone",
                  placeholder: "+44 555 5555",
                  keyboardType: "phone-pad",
                  textContentType: "telephoneNumber",
                  value: phone,
                  onChangeText: setPhone,
                })}

                {renderField({
                  label: "Email Address",
                  icon: "mail",
                  placeholder: "example@example.com",
                  autoCapitalize: "none",
                  keyboardType: "email-address",
                  textContentType: "emailAddress",
                  autoCorrect: false,
                  value: email,
                  onChangeText: setEmail,
                  editable: false,
                })}

                <View style={styles.divider} />

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>

                  <Switch
                    value={pushNotifications}
                    onValueChange={setPushNotifications}
                    trackColor={{ false: SWITCH_OFF, true: TEAL }}
                    thumbColor={WHITE}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Turn Dark Theme</Text>

                  <Switch
                    value={darkTheme}
                    onValueChange={setDarkTheme}
                    trackColor={{ false: SWITCH_OFF, true: TEAL }}
                    thumbColor={WHITE}
                  />
                </View>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.updateButton,
                isDesktop && styles.updateButtonDesktop,
                pressed && styles.updateButtonPressed,
                isLoading && styles.updateButtonDisabled,
              ]}
              onPress={handleUpdateProfile}
              disabled={isLoading}
            >
              <Text style={styles.updateButtonText}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <AvatarPickerModal
        visible={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onApply={({ icon, backgroundColor }) => {
          setAvatarIcon(icon);
          setAvatarColor(backgroundColor);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const TEAL = "#00c896";
const DARK_TEAL = "#063b3a";
const SOFT_TEAL = "#a9efdf";
const VERY_SOFT_TEAL = "#eafaf5";
const CARD = "#fbfffd";
const WHITE = "#ffffff";
const MUTED = "#5e7b78";
const INPUT_BG = "#eef8f2";
const GRID = "rgba(6, 59, 58, 0.09)";
const SWITCH_OFF = "#d4e2df";
const GREEN = "#dff7ef";
const DESKTOP_BREAKPOINT = 768;
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
    paddingBottom: 80,
  },

  desktopLayout: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
  },

  desktopLayoutMobile: {
    flexDirection: "column",
    gap: 0,
  },

  profileCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 24,
    alignItems: "center",
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  profileCardDesktop: {
    width: 320,
    minHeight: 378,
    marginBottom: 0,
    paddingTop: 34,
    paddingBottom: 34,
    justifyContent: "center",
  },

  avatarOuterRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },

  logoImage: {
    width: 85,
    height: 85,
  },

  editAvatarButton: {
    position: "absolute",
    right: -2,
    bottom: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "rgba(0, 0, 0, 0.12)",
    borderWidth: 1,
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  nameContainer: {
    alignItems: "center",
  },

  name: {
    fontSize: 21,
    lineHeight: 27,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
  },

  userId: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: MUTED,
    marginTop: 6,
  },

  sectionHeader: {
    marginBottom: 14,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    alignSelf: "flex-start",
    fontSize: 15,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
    paddingBottom: 4,
  },

  settingsColumn: {
    width: "100%",
  },

  settingsColumnDesktop: {
    flex: 1,
  },

  settingsCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  settingsCardDesktop: {
    flex: 1,
    marginBottom: 0,
    paddingVertical: 24,
    paddingHorizontal: 24,
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
    paddingHorizontal: 10,
  },

  inputBoxDisabled: {
    opacity: 0.9,
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
  },

  divider: {
    height: 1,
    backgroundColor: GRID,
    marginLeft: 2,
  },

  settingRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },

  settingLabel: {
    fontSize: 14,
    color: DARK_TEAL,
    fontFamily: fonts.medium,
  },

  updateButton: {
    alignSelf: "center",
    width: 214,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#c9f3df",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(29, 100, 89, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  updateButtonDesktop: {
    alignSelf: "center",
    width: 220,
    marginTop: 25,
  },

  updateButtonPressed: {
    opacity: 0.82,
  },

  updateButtonDisabled: {
    opacity: 0.7,
  },

  updateButtonText: {
    color: DARK_TEAL,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});
