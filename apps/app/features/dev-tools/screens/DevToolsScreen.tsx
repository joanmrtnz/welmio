import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { ConfirmDialog } from "@/components/ui/confirm-dialog/ConfirmDialog";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";
import { getUserProfile } from "@/features/profile/services/profile-service";
import { fonts } from "@/theme/fonts";
import { DevToolsPanel } from "../components/DevToolsPanel";
import type { DevToolAction } from "../constants/devToolActions";
import { runDevToolAction } from "../services/dev-tools.service";

const VERY_SOFT_TEAL = "#dff7ef";
const DARK_TEAL = "#063b3a";
const MUTED = "#5e7b78";
const CARD = "#fbfffd";
const DESKTOP_BREAKPOINT = 768;
const DESKTOP_CONTENT_WIDTH = 720;

export function DevToolsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<DevToolAction | null>(null);

  async function runAction(action: DevToolAction) {
    try {
      setLoadingActionId(action.id);

      const user = await getUserProfile();

      if (user.role !== "ADMIN") {
        feedback.warning("Dev tools are only available for admins.");
        return;
      }

      const result = await runDevToolAction(action.id);

      if (result.success) {
        feedback.success(getActionSuccessMessage(result.message, result.summary));
      } else {
        feedback.error("Dev tool action failed.");
      }
    } catch (error) {
      console.warn("[DevToolsScreen] action error:", error);
      feedback.error("Dev tool action failed.");
    } finally {
      setLoadingActionId(null);
      setPendingAction(null);
    }
  }

  function handleActionPress(action: DevToolAction) {
    if (action.destructive) {
      setPendingAction(action);
      return;
    }

    void runAction(action);
  }

  function handleConfirmAction() {
    if (!pendingAction) return;

    void runAction(pendingAction);
  }

  function handleCancelAction() {
    if (loadingActionId) return;

    setPendingAction(null);
  }

  return (
    <View style={styles.screen}>
      <AppScreenHeader title="Dev Tools" backHref="/profile" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isDesktop && styles.contentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.title}>Tester actions</Text>
          <Text style={styles.subtitle}>
            These controls run backend tester actions on your admin account.
          </Text>
        </View>

        <DevToolsPanel
          loadingActionId={loadingActionId}
          onActionPress={handleActionPress}
        />
      </ScrollView>

      <ConfirmDialog
        visible={Boolean(pendingAction)}
        title="Confirm action"
        message="This will permanently delete up to 10 transactions from your account."
        confirmLabel="Run action"
        cancelLabel="Cancel"
        loadingLabel="Running..."
        destructive
        isLoading={Boolean(loadingActionId)}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </View>
  );
}

function getActionSuccessMessage(
  message: string,
  summary?: Record<string, number | string | boolean>,
) {
  if (!summary) {
    return message;
  }

  if (typeof summary.created === "number") {
    return `${message} Created: ${summary.created}.`;
  }

  if (typeof summary.deleted === "number") {
    return `${message} Deleted: ${summary.deleted}.`;
  }

  if (typeof summary.updated === "number") {
    return `${message} Updated: ${summary.updated}.`;
  }

  return message;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: VERY_SOFT_TEAL,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 18,
  },

  contentDesktop: {
    width: "100%",
    maxWidth: DESKTOP_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 32,
  },

  headerCard: {
    borderRadius: 8,
    backgroundColor: CARD,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  title: {
    color: DARK_TEAL,
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 23,
  },

  subtitle: {
    color: MUTED,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
});
