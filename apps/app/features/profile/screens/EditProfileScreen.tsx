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
} from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { getUserProfile, updateUserProfile } from "../services/profile-service";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { router } from "expo-router";
import { AvatarPickerModal } from "../components/AvatarPickerModal";
import { IconName } from "@repo/shared-types";

export default function EditProfileScreen() {
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
          <Icon name={icon} size={20} strokeWidth={1.8} color={PRIMARY} />
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
      <View style={styles.headerArea}>
        <Pressable
          style={styles.headerIconButton}
          onPress={() => router.back()}
        >
          <Icon name="arrowLeft" size={22} strokeWidth={2.4} color={BLACK} />
        </Pressable>

        <Text style={styles.title}>Edit My Profile</Text>

        <View style={styles.notifications}>
          <Icon name="bell" size={24} strokeWidth={1.7} color={BLACK} />
        </View>
      </View>

      <View style={styles.avatarWrapper}>
        <View>
          <View
            style={[
              styles.avatar,
              { backgroundColor: avatarColor || AVATAR_BG },
            ]}
          >
            <Icon
              name={avatarIcon}
              size={48}
              strokeWidth={1.7}
              color={PRIMARY}
            />
          </View>

          <Pressable
            style={styles.editAvatarButton}
            onPress={() => setShowAvatarModal(true)}
          >
            <Icon name="edit" size={18} strokeWidth={1.8} color={BLACK} />
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardContent}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{usernameLabel || "User"}</Text>
            <Text style={styles.userId}>{email ? email : "-"}</Text>
          </View>

          <Text style={styles.sectionTitle}>Account Settings</Text>

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

            <View style={styles.settingsBlock}>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Push Notifications</Text>

                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: SWITCH_OFF, true: PRIMARY }}
                  thumbColor={WHITE}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Turn Dark Theme</Text>

                <Switch
                  value={darkTheme}
                  onValueChange={setDarkTheme}
                  trackColor={{ false: SWITCH_OFF, true: PRIMARY }}
                  thumbColor={WHITE}
                />
              </View>
            </View>

            <View style={styles.buttons}>
              <Pressable
                style={({ pressed }) => [
                  styles.updateButton,
                  pressed && styles.updateButtonPressed,
                  isLoading && styles.updateButtonDisabled,
                ]}
                onPress={handleUpdateProfile}
                disabled={isLoading}
              >
                <Text style={styles.updateButtonText}>
                  {isLoading ? "Loading..." : "Update Profile"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>

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

const GREEN = "#dff7ef";
const PRIMARY = "#12b895";
const AVATAR_BG = "#e6f8f1";
const WHITE = "#ffffff";
const BLACK = "#073331";
const MUTED = "#7b8a8c";
const INPUT_BG = "#eef8f2";
const SWITCH_OFF = "#d4e2df";

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
    paddingHorizontal: 26,
    paddingTop: 26,
  },

  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    color: BLACK,
    fontFamily: fonts.bold,
    letterSpacing: 0.2,
  },

  notifications: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  avatarWrapper: {
    position: "absolute",
    top: 104,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },

  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(18, 184, 149, 0.25)",
    shadowColor: "rgba(29, 100, 89, 0.10)",
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  editAvatarButton: {
    position: "absolute",
    right: -4,
    bottom: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(29, 100, 89, 0.16)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  card: {
    flex: 1,
    backgroundColor: "#fbfffc",
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    borderWidth: 1,
    borderColor: "rgba(18, 184, 149, 0.08)",
    paddingHorizontal: 26,
  },

  cardContent: {
    paddingTop: 78,
    paddingBottom: 56,
  },

  nameContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  name: {
    fontSize: 19,
    color: BLACK,
    fontFamily: fonts.bold,
  },

  userId: {
    marginTop: 8,
    fontSize: 13,
    color: MUTED,
    fontFamily: fonts.regular,
  },

  sectionTitle: {
    fontSize: 18,
    color: BLACK,
    fontFamily: fonts.bold,
    marginBottom: 22,
  },

  form: {
    gap: 18,
  },

  inputGroup: {
    gap: 10,
  },

  inputLabel: {
    fontSize: 13,
    color: BLACK,
    fontFamily: fonts.bold,
  },

  inputBox: {
    minHeight: 50,
    borderRadius: 13,
    backgroundColor: INPUT_BG,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "rgba(29, 100, 89, 0.05)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },

  inputBoxDisabled: {
    opacity: 0.9,
  },

  inputIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(18, 184, 149, 0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  input: {
    flex: 1,
    minWidth: 0,
    height: 50,
    color: BLACK,
    fontSize: 14,
    fontFamily: fonts.medium,
    paddingVertical: 0,
  },

  settingsBlock: {
    gap: 18,
    marginTop: 10,
  },

  settingRow: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingLabel: {
    fontSize: 14,
    color: BLACK,
    fontFamily: fonts.medium,
  },

  buttons: {
    alignItems: "center",
    marginTop: 24,
  },

  updateButton: {
    width: 210,
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

  updateButtonPressed: {
    opacity: 0.82,
  },

  updateButtonDisabled: {
    opacity: 0.7,
  },

  updateButtonText: {
    color: BLACK,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});
