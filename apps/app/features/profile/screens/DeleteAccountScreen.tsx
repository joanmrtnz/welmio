import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog/ConfirmDialog";
import { deleteAccount } from "../services/profile-service";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { removeAccessToken } from "@/app/lib/auth-storage";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";

export default function DeleteAccountScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [confirmationText, setConfirmationText] = useState("");
  const isDeleteButtonDisabled =
    confirmationText.trim().toLowerCase() !== "delete";
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleOpenDeleteDialog() {
    if (isDeleteButtonDisabled) {
      return;
    }

    setShowConfirmDialog(true);
  }

  async function handleConfirmDeleteAccount() {
    try {
      setIsDeleting(true);

      await deleteAccount({
        confirmationText,
      });

      await removeAccessToken();

      feedback.success("Account deleted successfully");
      setShowConfirmDialog(false);

      router.replace("/login");
    } catch (error) {
      console.warn(error);
      feedback.error("Error deleting account");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppScreenHeader title="Delete Account" />

      <View style={[styles.card, isDesktop && styles.cardDesktop]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.cardContent,
            isDesktop && styles.cardContentDesktop,
          ]}
        >
          <Text style={[styles.confirmTitle, isDesktop && styles.confirmTitleDesktop]}>
            Are You Sure You Want To Delete{isDesktop ? " " : "\n"}Your Account?
          </Text>

          <View style={[styles.desktopGrid, !isDesktop && styles.mobileGrid]}>
            <View style={[styles.warningBox, isDesktop && styles.warningBoxDesktop]}>

              <Text style={[styles.warningText, isDesktop && styles.warningTextDesktop]}>
                This action will permanently delete all of your data, and you will
                not be able to recover it. Please keep the following in mind
                before proceeding:
              </Text>

              <Text style={styles.bulletText}>
                All your expenses, income and associated transactions will be
                eliminated.
              </Text>

              <Text style={styles.bulletText}>
                You will not be able to access your account or any related
                information.
              </Text>

              <Text style={[styles.bulletText, styles.lastBulletText]}>
                This action cannot be undone.
              </Text>
            </View>

            <View style={[styles.confirmPanel, isDesktop && styles.confirmPanelDesktop]}>
              <Text
                style={[styles.passwordTitle, isDesktop && styles.passwordTitleDesktop]}
              >
                Please Type "delete" To Confirm{isDesktop ? " " : "\n"}
                Deletion Of Your Account.
              </Text>

              <View style={[styles.form, isDesktop && styles.formDesktop]}>
                <View style={styles.inputShell}>
                  <TextInput
                    style={styles.confirmInput}
                    placeholder='Type "delete"'
                    placeholderTextColor={MUTED}
                    value={confirmationText}
                    onChangeText={setConfirmationText}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <Pressable
                  style={[
                    styles.deleteButton,
                    isDesktop && styles.deleteButtonDesktop,
                    isDeleteButtonDisabled && styles.deleteButtonDisabled,
                  ]}
                  onPress={handleOpenDeleteDialog}
                  disabled={isDeleteButtonDisabled}
                >
                  <Text
                    style={[
                      styles.deleteButtonText,
                      isDeleteButtonDisabled && styles.deleteButtonTextDisabled,
                    ]}
                  >
                    Yes, Delete Account
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <ConfirmDialog
        visible={showConfirmDialog}
        title="Delete Account"
        message={`Are you sure you want to delete your account?

      By deleting your account, you agree that you understand the consequences of this action and that all associated data will be permanently deleted.`}
        confirmLabel="Yes, Delete Account"
        cancelLabel="Cancel"
        loadingLabel="Deleting..."
        destructive
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </KeyboardAvoidingView>
  );
}

const GREEN = "#dff7ef";
const PRIMARY = "#00a982";
const PRIMARY_SOFT = "#b9eadc";
const CARD = "#fbfffd";
const BOX_GREEN = "#edf9f4";
const BORDER = "rgba(4, 94, 79, 0.08)";
const BLACK = "#073b3a";
const MUTED = "#8da09c";
const WHITE = "#ffffff";
const DANGER = "#ff8f7a";
const DANGER_DISABLED = "#ffd8d0";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  card: {
    flex: 1,
    backgroundColor: CARD,
    borderTopLeftRadius: 54,
    borderTopRightRadius: 54,
    paddingHorizontal: 24,
    paddingTop: 26,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "rgba(10, 58, 52, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: -6 },
    elevation: 8,
  },

  cardDesktop: {
    width: "100%",
    maxWidth: 1040,
    alignSelf: "center",
    flex: 0,
    marginTop: 24,
    marginBottom: 40,
    borderRadius: 36,
    paddingHorizontal: 32,
    paddingTop: 30,
    minHeight: 560,
    shadowColor: "rgba(10, 58, 52, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  cardContent: {
    paddingTop: 28,
    paddingBottom: 70,
  },

  cardContentDesktop: {
    paddingTop: 18,
    paddingBottom: 36,
  },

  confirmTitle: {
    fontSize: 17,
    color: BLACK,
    fontFamily: fonts.medium,
    textAlign: "center",
    lineHeight: 25,
    letterSpacing: 0.3,
    marginBottom: 34,
  },

  confirmTitleDesktop: {
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 32,
  },

  desktopGrid: {
    flexDirection: "row",
    gap: 28,
    alignItems: "stretch",
  },

  mobileGrid: {
    flexDirection: "column",
    gap: 0,
  },

  warningBox: {
    backgroundColor: BOX_GREEN,
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 22,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: "rgba(0, 169, 130, 0.06)",
  },

  warningBoxDesktop: {
    flex: 1,
    marginBottom: 0,
    borderRadius: 22,
    paddingHorizontal: 28,
    paddingVertical: 28,
  },

  warningIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  warningText: {
    fontSize: 13,
    color: BLACK,
    fontFamily: fonts.regular,
    lineHeight: 22,
    marginBottom: 18,
  },

  warningTextDesktop: {
    fontSize: 14,
    lineHeight: 24,
  },

  bulletText: {
    fontSize: 13,
    color: BLACK,
    fontFamily: fonts.regular,
    lineHeight: 22,
    marginBottom: 18,
  },

  lastBulletText: {
    marginBottom: 0,
  },

  confirmPanel: {},

  confirmPanelDesktop: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 28,
    paddingVertical: 28,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
  },

  passwordTitle: {
    fontSize: 16,
    color: BLACK,
    fontFamily: fonts.medium,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 24,
    letterSpacing: 0.2,
  },

  passwordTitleDesktop: {
    textAlign: "left",
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 30,
  },

  form: {
    gap: 38,
    alignItems: "center",
  },

  formDesktop: {
    gap: 24,
    alignItems: "center",
  },

  inputShell: {
    width: "100%",
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: BOX_GREEN,
    borderWidth: 1,
    borderColor: "rgba(0, 169, 130, 0.06)",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  confirmInput: {
    minHeight: 54,
    color: BLACK,
    fontFamily: fonts.medium,
    fontSize: 14,
  },

  deleteButton: {
    width: "66%",
    height: 50,
    borderRadius: 25,
    backgroundColor: DANGER,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(255, 107, 91, 0.22)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  deleteButtonDesktop: {
    width: 240,
  },

  deleteButtonDisabled: {
    backgroundColor: DANGER_DISABLED,
    opacity: 0.78,
  },

  deleteButtonText: {
    color: BLACK,
    fontFamily: fonts.bold,
    fontSize: 14,
  },

  deleteButtonTextDisabled: {
    color: "rgba(7, 59, 58, 0.55)",
  },
});
