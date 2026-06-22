import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { getUserProfile } from "@/features/profile/services/profile-service";
import { fonts } from "@/theme/fonts";
import { ProfileOption } from "../components/ProfileOption";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { clearAuthTokens, getRefreshToken } from "@/lib/auth/auth-storage";
import { logout } from "@/lib/api/auth";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { ConfirmDialog } from "@/components/ui/confirm-dialog/ConfirmDialog";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";
import { AVATAR_IMAGES, type AvatarId } from "../components/AvatarPickerModal";
import { AppImage } from "@/components/images/AppImage";
import { t } from "@/lib/i18n";

const TEAL = "#00c896";
const DARK_TEAL = "#063b3a";
const MID_TEAL = "#68e1c6";
const SOFT_TEAL = "#a9efdf";
const VERY_SOFT_TEAL = "#dff7ef";
const CARD = "#fbfffd";
const WHITE = "#ffffff";
const MUTED = "#5e7b78";
const GRID = "rgba(6, 59, 58, 0.09)";
const LIGHT_GRAY = "rgba(0, 0, 0, 0.2)";
const DESKTOP_BREAKPOINT = 768;
const DESKTOP_CONTENT_WIDTH = 1040;
const APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION?.trim() || "pre";


function getAvatarId(value?: string | null): AvatarId {
  return value && value in AVATAR_IMAGES ? (value as AvatarId) : "avatar-0";
}

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarIcon, setAvatarIcon] = useState<AvatarId>("avatar-0");
  const [avatarColor, setAvatarColor] = useState(WHITE);

  const selectedAvatarImage =
    AVATAR_IMAGES[avatarIcon] ?? AVATAR_IMAGES["avatar-0"];

 const loadUserProfile = useCallback(async () => {
    try {
      const user = await getUserProfile();

      setFullName(user.fullName ?? "");
      setEmail(user.email ?? "");
      setAvatarIcon(getAvatarId(user.avatarIcon));
      setAvatarColor(user.avatarColor ?? "#00c896");
    } catch (error) {
      console.warn("Error loading profile", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [loadUserProfile])
  );

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

      const refreshToken = await getRefreshToken();

      try {
        await logout(refreshToken);
      } catch (error) {
        console.warn("Error revoking refresh token", error);
      }

      await clearAuthTokens();

      setShowLogoutDialog(false);
      router.replace("/login");
    } catch (error) {
      console.warn(error);
      feedback.error(t("profile.feedback.logoutError"));
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <View style={styles.screen}>
      <AppScreenHeader title={t("profile.title")} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isDesktop && styles.contentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.desktopGrid, !isDesktop && styles.mobileGrid]}>
          <View
            style={[styles.profileCard, isDesktop && styles.profileCardDesktop]}
          >
            <View style={styles.avatarOuterRing}>
              <View
                style={styles.avatar}
              >
                <AppImage
                  source={selectedAvatarImage}
                  style={styles.logoImage}
                />
              </View>
            </View>

            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {fullName || t("profile.defaultUser")}
              </Text>
              <Text style={styles.userId}>{email ? email : "-"}</Text>
            </View>
          </View>

          <View
            style={[styles.optionsCard, isDesktop && styles.optionsCardDesktop]}
          >
            <ProfileOption
              icon="user"
              label={t("profile.options.editProfile")}
              onPress={() => router.push("/profile/edit")}
            />
            {/* <View style={styles.divider} />
            <ProfileOption
              icon="shield"
              label="Security"
              onPress={() => router.push("/profile/security")}
            /> */}
            <View style={styles.divider} />
            <ProfileOption
              icon="settings"
              label={t("profile.options.settings")}
              onPress={() => router.push("/profile/settings")}
            />
            <View style={styles.divider} />
            <ProfileOption
              icon="language"
              label={t("profile.options.language")}
              onPress={() => router.push("/profile/language")}
            />
            <View style={styles.divider} />
            <ProfileOption
              icon="logout"
              label={t("profile.options.logout")}
              onPress={handleOpenLogoutDialog}
            />
             <View style={styles.divider} />
              <View style={styles.versionContainer}>
                <Text style={styles.versionText}>{APP_VERSION}</Text>
              </View>
          </View>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showLogoutDialog}
        title={t("profile.logoutDialog.title")}
        message={t("profile.logoutDialog.message")}
        confirmLabel={t("profile.logoutDialog.confirmLabel")}
        cancelLabel={t("profile.logoutDialog.cancelLabel")}
        loadingLabel={t("profile.logoutDialog.loadingLabel")}
        destructive={true}
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

  mobileGrid: {
    width: "100%",
  },

  desktopGrid: {
    width: "100%",
    gap: 24,
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
    flex: 0.9,
    minHeight: 292,
    justifyContent: "center",
    marginBottom: 0,
    paddingVertical: 36,
  },

  avatarOuterRing: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: SOFT_TEAL,
    padding: 5,
    marginBottom: 16,
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 47,
    backgroundColor: WHITE,
    overflow: "hidden",
  },

  logoBadge: {
    width: 31,
    height: 31,
    borderRadius: 18,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    borderColor: LIGHT_GRAY,
    borderWidth: 1,
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  logoImage: {
    width: "100%",
    height: "100%",
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

  optionsCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  optionsCardDesktop: {
    flex: 1.4,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  divider: {
    height: 1,
    marginLeft: 60,
    backgroundColor: GRID,
  },

 versionContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 14,
  },

  versionText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
