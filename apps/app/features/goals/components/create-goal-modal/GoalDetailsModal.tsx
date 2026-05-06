import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon } from "@/components/icons/Icon";
import { fonts } from "@/theme/fonts";
import { GoalContributionItem, GoalOverviewItem } from "@repo/shared-types";
import { useCallback, useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog/ConfirmDialog";
import { getGoalContributions } from "../../services/goals.service";

const WHITE = "#ffffff";
const BLACK = "#052e2b";
const LIGHT_GREEN = "#eefbf6";
const SOFT_GREEN = "#d8f5ea";
const BUTTON_GREEN = "#93e2c9";
const TAB_GREEN = "#12c79b";
const BORDER_GREEN = "rgba(8, 120, 98, 0.14)";
const MUTED = "rgba(5, 46, 43, 0.58)";
const RED = "#dc2626";

type GoalDetailsModalProps = {
  visible: boolean;
  goal: GoalOverviewItem | null;
  onClose: () => void;
  onEdit?: (goal: GoalOverviewItem) => void;
  onDelete?: (goal: GoalOverviewItem) => Promise<void>;
  onAddContribution?: (goal: GoalOverviewItem) => void;
  onDeleteContribution?: (
    goal: GoalOverviewItem,
    contribution: GoalContributionItem,
  ) => Promise<void>;
};

function formatCurrency(amount: number | string, currency = "USD") {
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number.isFinite(numericAmount) ? numericAmount : 0);
}

function formatDate(date?: string | null) {
  if (!date) return "No deadline";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function GoalDetailsModal({
  visible,
  goal,
  onClose,
  onEdit,
  onDelete,
  onAddContribution,
  onDeleteContribution,
}: GoalDetailsModalProps) {
  if (!goal) return null;
  const remainingAmount = Math.max(goal.target - goal.saved, 0);
  const progress = Math.min(goal.progress, 100);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeletingContribution, setIsDeletingContribution] = useState(false);
  const [showDeleteContributionDialog, setShowDeleteContributionDialog] =
    useState(false);
  const [selectedContributionToDelete, setSelectedContributionToDelete] =
    useState<GoalContributionItem | null>(null);
  const [contributions, setContributions] = useState<GoalContributionItem[]>(
    [],
  );
  const [isLoadingContributions, setIsLoadingContributions] = useState(false);
  const [contributionsError, setContributionsError] = useState<string | null>(
    null,
  );
  const contributionsCount = goal.contributionsCount ?? 0;
  const deleteMessage =
    contributionsCount > 0
      ? `Are you sure you want to delete this goal?
  This will also delete ${contributionsCount} contribution${
    contributionsCount === 1 ? "" : "s"
  } linked to this goal.
  This action cannot be undone.`
      : `Are you sure you want to delete this goal?
  This action cannot be undone.`;

  function handleEditGoal() {
    if (!goal) return;

    onClose();
    onEdit?.(goal);
  }

  function handleOpenDeleteDialog() {
    setShowDeleteDialog(true);
  }

  function handleCloseDeleteDialog() {
    if (isDeleting) return;

    setShowDeleteDialog(false);
  }

  async function handleConfirmDeleteGoal() {
    if (!goal || isDeleting || !onDelete) return;

    try {
      setIsDeleting(true);

      await onDelete(goal);

      setShowDeleteDialog(false);
    } catch (error) {
      console.warn("[GoalDetailsModal] delete goal error:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleAddContribution() {
    if (!goal) return;

    onAddContribution?.(goal);
  }

  async function handleDeleteContribution(contribution: GoalContributionItem) {
    if (!goal || !onDeleteContribution) return;

    try {
      await onDeleteContribution(goal, contribution);
      await loadGoalContributions();
    } catch (error) {
      console.warn("[GoalDetailsModal] delete contribution error:", error);
    }
  }

  function handleOpenDeleteContributionDialog(
    contribution: GoalContributionItem,
  ) {
    setSelectedContributionToDelete(contribution);
    setShowDeleteContributionDialog(true);
  }

  function handleCloseDeleteContributionDialog() {
    if (isDeletingContribution) return;

    setShowDeleteContributionDialog(false);
    setSelectedContributionToDelete(null);
  }

  async function handleConfirmDeleteContribution() {
    if (
      !goal ||
      !selectedContributionToDelete ||
      isDeletingContribution ||
      !onDeleteContribution
    ) {
      return;
    }

    try {
      setIsDeletingContribution(true);

      await onDeleteContribution(goal, selectedContributionToDelete);
      await loadGoalContributions();

      setShowDeleteContributionDialog(false);
      setSelectedContributionToDelete(null);
    } catch (error) {
      console.warn("[GoalDetailsModal] delete contribution error:", error);
    } finally {
      setIsDeletingContribution(false);
    }
  }

  const loadGoalContributions = useCallback(async () => {
    if (!goal?.id) return;

    try {
      setIsLoadingContributions(true);
      setContributionsError(null);

      const response = await getGoalContributions(goal.id);

      setContributions(response);
    } catch (error) {
      console.warn("[GoalDetailsModal] load contributions error:", error);
      setContributionsError("Could not load contributions.");
    } finally {
      setIsLoadingContributions(false);
    }
  }, [goal?.id]);

  useEffect(() => {
    if (!visible || !goal?.id) {
      setContributions([]);
      setContributionsError(null);
      return;
    }

    loadGoalContributions();
  }, [visible, goal?.id, loadGoalContributions]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modal}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Goal Details</Text>

            <View style={styles.headerActions}>
              <Pressable style={styles.iconButton} onPress={handleEditGoal}>
                <Icon name="edit" size={16} strokeWidth={1.5} color={BLACK} />
              </Pressable>

              <Pressable
                style={[styles.iconButton, styles.deleteIconButton]}
                onPress={handleOpenDeleteDialog}
                disabled={isDeleting}
              >
                <Icon name="bin" size={23} strokeWidth={1.5} color={RED} />
              </Pressable>

              <Pressable style={styles.iconButton} onPress={onClose}>
                <Icon name="close" size={20} color={BLACK} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.heroCard}>
              <View style={styles.heroTop}>
                <View style={styles.heroIcon}>
                  <Icon
                    name={(goal.icon ?? "rent") as never}
                    size={44}
                    color={TAB_GREEN}
                    strokeWidth={1.1}
                  />
                </View>

                <View style={styles.heroInfo}>
                  <Text style={styles.heroLabel}>{goal.statusLabel}</Text>
                  <Text style={styles.heroTitle}>{goal.name}</Text>
                  <Text style={styles.heroMeta}>
                    {goal.type.replace("_", " ")} ·{" "}
                    {formatDate(goal.targetDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.progressCircle}>
                <Text style={styles.progressValue}>{progress}%</Text>
                <Text style={styles.progressLabel}>completed</Text>
              </View>

              <View style={styles.mainProgressBar}>
                <View
                  style={[
                    styles.mainProgressFill,
                    {
                      width: `${progress}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.amountsCard}>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Saved</Text>
                <Text style={styles.amountValue}>
                  {formatCurrency(goal.saved, goal.currency)}
                </Text>
              </View>

              <View style={styles.amountSeparator} />

              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Target</Text>
                <Text style={styles.amountValue}>
                  {formatCurrency(goal.target, goal.currency)}
                </Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Icon
                    name="money"
                    size={24}
                    color={BLACK}
                    strokeWidth={1.2}
                  />
                </View>

                <Text style={styles.statLabel}>Remaining</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(remainingAmount, goal.currency)}
                </Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Icon
                    name="calendar"
                    size={24}
                    color={BLACK}
                    strokeWidth={1.2}
                  />
                </View>

                <Text style={styles.statLabel}>Monthly needed</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(goal.monthlyNeeded, goal.currency)}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Progress insight</Text>

              <Text style={styles.infoText}>
                You have saved {formatCurrency(goal.saved, goal.currency)} of{" "}
                {formatCurrency(goal.target, goal.currency)}. To reach this goal
                on time, you need around{" "}
                {formatCurrency(goal.monthlyNeeded, goal.currency)} per month.
              </Text>
            </View>

            <View style={styles.mockHistoryCard}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Recent contributions</Text>
                  <Text style={styles.sectionSubtitle}>
                    Latest money added to this goal
                  </Text>
                </View>

                <Pressable
                  style={styles.addContributionButton}
                  onPress={handleAddContribution}
                >
                  <Icon name="plus" size={18} color={BLACK} strokeWidth={1.8} />
                </Pressable>
              </View>

              {isLoadingContributions ? (
                <Text style={styles.emptyContributionsText}>
                  Loading contributions...
                </Text>
              ) : contributionsError ? (
                <Text style={styles.errorContributionsText}>
                  {contributionsError}
                </Text>
              ) : contributions.length === 0 ? (
                <Text style={styles.emptyContributionsText}>
                  No contributions yet. Add your first one to start tracking
                  this goal.
                </Text>
              ) : (
                contributions.map((contribution) => (
                  <View key={contribution.id} style={styles.historyItem}>
                    <View style={styles.historyIcon}>
                      <Icon
                        name="income"
                        size={22}
                        color={TAB_GREEN}
                        strokeWidth={1.3}
                      />
                    </View>

                    <View style={styles.historyContent}>
                      <Text style={styles.historyTitle} numberOfLines={1}>
                        {contribution.description ||
                          contribution.notes ||
                          "Goal contribution"}
                      </Text>

                      <Text style={styles.historyDate}>
                        {formatDate(contribution.date)}
                      </Text>
                    </View>

                    <Text style={styles.historyAmount}>
                      +
                      {formatCurrency(
                        contribution.amount,
                        contribution.currency,
                      )}
                    </Text>

                    <Pressable
                      style={styles.deleteContributionButton}
                      onPress={() =>
                        handleOpenDeleteContributionDialog(contribution)
                      }
                      disabled={isDeletingContribution}
                    >
                      <Icon
                        name="bin"
                        size={17}
                        color={RED}
                        strokeWidth={1.5}
                      />
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
          <View style={styles.actionsRow}>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => {
                if (!goal) return;

                onClose();
                onEdit?.(goal);
              }}
            >
              <Text style={styles.secondaryButtonText}>Edit goal</Text>
            </Pressable>

             <Pressable
              style={styles.deleteButton}
              onPress={handleOpenDeleteDialog}
              disabled={isDeleting}
            >
              <Icon
                name="bin"
                size={23}
                strokeWidth={2}
                color={RED}
              />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete Goal"
        message={deleteMessage}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        loadingLabel="Deleting..."
        destructive
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteGoal}
        onCancel={handleCloseDeleteDialog}
      />

      <ConfirmDialog
        visible={showDeleteContributionDialog}
        title="Delete Contribution"
        message={`Are you sure you want to delete this contribution?
      This will remove it from the goal progress, but the linked transaction will not be deleted.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        loadingLabel="Deleting..."
        destructive
        isLoading={isDeletingContribution}
        onConfirm={handleConfirmDeleteContribution}
        onCancel={handleCloseDeleteContributionDialog}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(223, 247, 239, 0.96)",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },

  modal: {
    width: "100%",
    maxHeight: "94%",
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 18,
    overflow: "hidden",
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: SOFT_GREEN,
    alignSelf: "center",
    marginBottom: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: {
    flex: 1,
    fontSize: 19,
    fontFamily: fonts.bold,
    color: BLACK,
    letterSpacing: 0.2,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },

  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteIconButton: {
    backgroundColor: "#fee2e2",
  },

  content: {
    paddingBottom: 16,
  },

  heroCard: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    padding: 18,
    marginBottom: 16,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  heroIcon: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  heroInfo: {
    flex: 1,
    minWidth: 0,
  },

  heroLabel: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: MUTED,
  },

  heroTitle: {
    fontSize: 19,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 4,
  },

  heroMeta: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: TAB_GREEN,
    marginTop: 5,
    textTransform: "capitalize",
  },

  progressCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 8,
    borderColor: WHITE,
    backgroundColor: SOFT_GREEN,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: "rgba(29, 100, 89, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  progressValue: {
    fontSize: 26,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  progressLabel: {
    fontSize: 11,
    fontFamily: fonts.semibold,
    color: MUTED,
    marginTop: 2,
  },

  mainProgressBar: {
    height: 10,
    borderRadius: 10,
    backgroundColor: WHITE,
    overflow: "hidden",
  },

  mainProgressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: TAB_GREEN,
  },

  amountsCard: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    paddingVertical: 16,
    marginBottom: 14,
  },

  amountItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },

  amountSeparator: {
    width: 1,
    backgroundColor: BORDER_GREEN,
  },

  amountLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  amountValue: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 5,
  },

  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    padding: 14,
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  statLabel: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  statValue: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 5,
  },

  infoCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    padding: 16,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  infoText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: MUTED,
    lineHeight: 19,
    marginTop: 8,
  },

  mockHistoryCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    padding: 16,
    marginBottom: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },

  mockLabel: {
    fontSize: 11,
    fontFamily: fonts.semibold,
    color: BLACK,
    backgroundColor: SOFT_GREEN,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(8, 120, 98, 0.08)",
  },

  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  historyContent: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },

  historyTitle: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  historyDate: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: MUTED,
    marginTop: 3,
  },

  historyAmount: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: TAB_GREEN,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 14,
    paddingTop: 10,
  },

  secondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 13,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  primaryButton: {
    flex: 1.2,
    height: 50,
    borderRadius: 13,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: WHITE,
  },

  addContributionButton: {
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  deleteButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  deleteButtonText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: RED,
  },

  deleteContributionButton: {
    width: 32,
    height: 32,
    borderRadius: 14,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  sectionSubtitle: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: MUTED,
    marginTop: 3,
  },

  emptyContributionsText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: MUTED,
    lineHeight: 18,
  },

  errorContributionsText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: RED,
    lineHeight: 18,
  },
});
