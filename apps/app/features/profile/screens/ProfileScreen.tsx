import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import type { IconName } from "@repo/shared-types";
import { getUserProfile } from "@/features/profile/services/profile-service";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { ProfileOption } from "../components/ProfileOption";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { removeAccessToken } from "@/app/lib/auth-storage";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { ConfirmDialog } from "@/components/ui/confirm-dialog/ConfirmDialog";

const MINT = "#12c79b";
const GREEN = "#dff7ef";
const WHITE = "#ffffff";
const DARK = "#082f32";
const MUTED = "#7f9698";

export default function ProfileScreen() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarIcon, setAvatarIcon] = useState<IconName>("user");
  const [avatarColor, setAvatarColor] = useState("#00c896");

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const user = await getUserProfile();

        setFullName(user.fullName ?? "");
        setEmail(user.email ?? "");
        setAvatarIcon(user.avatarIcon ?? "user");
        setAvatarColor(user.avatarColor ?? "#00c896");
      } catch (error) {
        console.warn("Error loading profile", error);
      }
    }

    loadUserProfile();
  }, []);

  function handleOpenLogoutDialog() {
    setShowLogoutDialog(true);
  }

  function handleCloseLogoutDialog() {
    if (isLoggingOut) {
      return;
    }

    setShowLogoutDialog(false);
  }

  async function handleConfirmLogout() {
    // TODO: disable push notifications
    try {
      setIsLoggingOut(true);

      await removeAccessToken();

      setShowLogoutDialog(false);
      router.replace("/login");
    } catch (error) {
      console.warn(error);
      feedback.error("Error ending session");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <View style={styles.screen}>
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(223, 247, 239, 0)", "#f7fffb", "#dff7ef"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.bottomGradient}
      />
      <View style={styles.headerArea}>
        <Pressable style={styles.headerButton} onPress={() => router.back()}>
          <Icon name="arrowLeft" size={24} strokeWidth={2.4} color={DARK} />
        </Pressable>

        <Text style={styles.title}>Profile</Text>

        <View style={styles.notifications}>
          <Icon name="bell" size={24} strokeWidth={1.8} color={DARK} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarOuterRing}>
            <View style={[styles.avatar, { borderColor: avatarColor || MINT }]}>
              <Icon
                name={avatarIcon}
                size={48}
                strokeWidth={1.8}
                color={avatarColor || MINT}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{fullName || "User"}</Text>
            <Text style={styles.userId}>{email ? email : "-"}</Text>
          </View>

          <View style={styles.optionsContainer}>
            <ProfileOption
              icon="user"
              label="Edit Profile"
              onPress={() => router.push("/profile/edit")}
            />
            <ProfileOption
              icon="shield"
              label="Security"
              onPress={() => router.push("/profile/security")}
            />
            <ProfileOption
              icon="settings"
              label="Settings"
              onPress={() => router.push("/profile/settings")}
            />
            <ProfileOption
              icon="logout"
              label="Logout"
              onPress={handleOpenLogoutDialog}
            />
          </View>
        </View>
      </View>

      <ConfirmDialog
        visible={showLogoutDialog}
        title="End Session"
        message="Are you sure you want to log out?"
        confirmLabel="Yes, End Session"
        cancelLabel="Cancel"
        loadingLabel="Ending..."
        isLoading={isLoggingOut}
        onConfirm={handleConfirmLogout}
        onCancel={handleCloseLogoutDialog}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 260,
    zIndex: 0,
  },

  headerArea: {
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 22,
  },

  headerButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: DARK,
  },

  notifications: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(25, 89, 80, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  content: {
    zIndex: 1,
    flex: 1,
    paddingTop: 38,
  },

  avatarWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
  },

  avatarOuterRing: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: "rgba(255, 255, 255, 0.42)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },

  card: {
    flex: 1,
    marginTop: 15,
    backgroundColor: "rgba(255, 255, 255, 0.68)",
    borderTopLeftRadius: 54,
    borderTopRightRadius: 54,
    paddingHorizontal: 20,
    paddingTop: 88,
    paddingBottom: 120,
    shadowColor: "rgba(34, 93, 84, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 2,
  },

  nameContainer: {
    alignItems: "center",
    marginBottom: 44,
  },

  name: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: DARK,
  },

  userId: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: MUTED,
    marginTop: 8,
  },

  optionsContainer: {
    gap: 16,
  },
});
