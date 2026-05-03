import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { AuthButton } from "@/features/auth/components/AuthButton";

export default function EditProfileScreen() {
  const [username, setUsername] = useState("John Smith");
  const [phone, setPhone] = useState("+44 555 5555");
  const [email, setEmail] = useState("example@example.com");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  function handleUpdateProfile() {
    console.log({
      username,
      phone,
      email,
      pushNotifications,
      darkTheme,
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <View style={styles.headerArea}>
        <Icon name="arrowLeft" size={22} strokeWidth={2.5} color={WHITE} />
        <Text style={styles.title}>Edit My Profile</Text>

        <View style={styles.notifications}>
            <Icon name="bell" size={28} strokeWidth={1.5} color={BLACK} />
        </View>
      </View>
      
      <View style={styles.avatarWrapper}>
        <View>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.avatar}
          />

          <Pressable style={styles.editAvatarButton}>
            <Text style={styles.editAvatarText}>
                 <Icon
                name="edit"
                size={15}
                strokeWidth={1.6}
                color={BLACK}
                />
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardContent}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.name}>John Smith</Text>
            <Text style={styles.userId}>ID: 25000024</Text>
          </View>

          <Text style={styles.sectionTitle}>Account Settings</Text>

          <View style={styles.form}>
            <AuthInput
              label="Username"
              placeholder="John Smith"
              autoCapitalize="words"
              textContentType="name"
              value={username}
              onChangeText={setUsername}
            />

            <AuthInput
              label="Phone"
              placeholder="+44 555 5555"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              value={phone}
              onChangeText={setPhone}
            />

            <AuthInput
              label="Email Address"
              placeholder="example@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Push Notifications</Text>

              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{
                  false: "#bff3df",
                  true: GREEN,
                }}
                thumbColor={WHITE}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Turn Dark Theme</Text>

              <Switch
                value={darkTheme}
                onValueChange={setDarkTheme}
                trackColor={{
                  false: "#bff3df",
                  true: GREEN,
                }}
                thumbColor={WHITE}
              />
            </View>

            <View style={styles.buttons}>
              <AuthButton
                title="Update Profile"
                onPress={handleUpdateProfile}
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
const WHITE = "#ffffff";
const BLACK = "#052e2b";

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

  avatarWrapper: {
    position: "absolute",
    top: 112,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: WHITE,
  },

  editAvatarButton: {
    position: "absolute",
    right: 3,
    bottom: 5,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },

  editAvatarText: {
    fontSize: 14,
    color: BLACK,
    fontFamily: fonts.bold,
  },

  card: {
    flex: 1,
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    padding: 24,
  },

  cardContent: {
    paddingTop: 55,
    paddingBottom: 60,
  },

  nameContainer: {
    alignItems: "center",
    marginBottom: 26,
  },

  name: {
    fontSize: 16,
    color: BLACK,
    fontFamily: fonts.bold,
  },

  userId: {
    marginTop: 3,
    fontSize: 10,
    color: BLACK,
    opacity: 0.6,
    fontFamily: fonts.regular,
  },

  sectionTitle: {
    fontSize: 16,
    color: BLACK,
    fontFamily: fonts.bold,
    marginBottom: 20,
  },

  form: {
    gap: 16,
  },

  settingRow: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingLabel: {
    fontSize: 12,
    color: BLACK,
    fontFamily: fonts.medium,
  },

  buttons: {
    alignItems: "center",
    marginTop: 6,
  },
});