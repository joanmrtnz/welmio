import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { ProfileOption } from "../components/ProfileOption";
import { router } from "expo-router";
import { useState } from "react";
import { removeAccessToken } from "@/app/lib/auth-storage";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { ConfirmDialog } from "@/components/ui/confirm-dialog/ConfirmDialog";

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const BUTTON_GREEN = "#1A9E6A";


export default function ProfileScreen() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      <View style={styles.headerArea}>
        <Pressable onPress={() => router.back()}>
            <Icon name="arrowLeft" size={22} strokeWidth={2.5} color={BLACK} />
        </Pressable>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.notifications}>
          <Icon name="bell" size={28} strokeWidth={1.5} color={BLACK} />
        </View>
      </View>

       <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.avatar}
          />
         
        </View>

      <View style={styles.card}>

        <View style={styles.nameContainer}>
          <Text style={styles.name}>John Smith</Text> 
          <Text style={styles.userId}>ID: 25000024</Text>
        </View>
       
        {/* Options */}
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

  headerArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 50,
  },

  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
  },

  notifications: {
    backgroundColor: WHITE,
    padding: 3,
    borderRadius: 100,
  },

  card: {
    flex: 1,
    marginTop: 60,
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    paddingHorizontal: 32,
    paddingTop: 75,
  },

 avatarWrapper: {
    position: "absolute",
    top: 110,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: WHITE,
  },

  nameContainer: {
    alignItems: "center",
    marginBottom: 20
  },

  name: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  userId: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
    opacity: 0.6,
    marginTop: 4,
  },

  optionsContainer: {
    gap: 5,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },

  optionLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: BLACK,
  },
});
