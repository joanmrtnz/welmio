import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  CreateGoalPayload,
  CreateTransactionInitialValues,
  GoalContributionItem,
  GoalOverviewItem,
  GoalsOverviewResponse,
  UpdateGoalPayload,
} from "@repo/shared-types";
import {
  createGoal,
  createGoalContribution,
  CreateGoalContributionPayload,
  deleteGoal,
  deleteGoalContribution,
  getGoalsOverview,
  updateGoal,
} from "../services/goals.service";
import { CreateGoalModal } from "../components/create-goal-modal/CreateGoalModal";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { GoalDetailsModal } from "../components/create-goal-modal/GoalDetailsModal";
import { CreateTransactionModal } from "@/features/transactions/components/create-transaction-modal/CreateTransactionModal";
import { formatGoalTargetDate } from "../utils/formatGoalTargetDate";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";

const GREEN = "#dff7ef";
const DIVIDER_GREEN = "#7adcc8";
const DARK_GREEN = "#0b8f78";
const LIGHT_GREEN = "#f8fffc";
const CARD_GREEN = "#e2f8f0";
const WHITE = "#ffffff";
const BLACK = "#082f33";
const TAB_GREEN = "#16b996";
const BUTTON_GREEN = "#10b992";
const SOFT_SHADOW = "rgba(28, 105, 91, 0.14)";

function formatCurrency(amount: number | string, currency = "USD") {
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number.isFinite(numericAmount) ? numericAmount : 0);
}

export default function GoalsScreen() {
  const [data, setData] = useState<GoalsOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreateGoalModalVisible, setIsCreateGoalModalVisible] =
    useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalOverviewItem | null>(
    null,
  );
  const [isGoalDetailsModalVisible, setIsGoalDetailsModalVisible] =
    useState(false);
  const [createGoalModalMode, setCreateGoalModalMode] = useState<
    "create" | "edit"
  >("create");
  const [editingGoal, setEditingGoal] = useState<GoalOverviewItem | null>(null);
  const [isCreateTransactionModalVisible, setIsCreateTransactionModalVisible] =
    useState(false);
  const [transactionInitialValues, setTransactionInitialValues] =
    useState<CreateTransactionInitialValues | null>(null);

  function openGoalDetails(goal: GoalOverviewItem) {
    setSelectedGoal(goal);
    setIsGoalDetailsModalVisible(true);
  }

  function closeGoalDetails() {
    setIsGoalDetailsModalVisible(false);
    setSelectedGoal(null);
  }

  async function handleCreateGoal(payload: CreateGoalPayload) {
    try {
      await createGoal(payload);
      await loadGoalsOverview();

      setIsCreateGoalModalVisible(false);
      feedback.success("Goal created successfully.");
    } catch (error) {
      console.warn(error);

      const message =
        error instanceof Error ? error.message : "Could not create goal.";

      feedback.error(message);
    }
  }

  async function handleUpdateGoal(goalId: string, payload: UpdateGoalPayload) {
    try {
      await updateGoal(goalId, payload);
      await loadGoalsOverview();

      setIsCreateGoalModalVisible(false);
      setEditingGoal(null);
      setCreateGoalModalMode("create");

      feedback.success("Goal updated successfully.");
    } catch (error) {
      console.warn(error);

      const message =
        error instanceof Error ? error.message : "Could not update goal.";

      feedback.error(message);
    }
  }

  async function handleDeleteGoal(goal: GoalOverviewItem) {
    try {
      console.log("Delete goal later", goal.id);

      await deleteGoal(goal.id);
      await loadGoalsOverview();

      setIsGoalDetailsModalVisible(false);
      setSelectedGoal(null);

      feedback.success("Goal deleted successfully.");
    } catch (error) {
      console.warn(error);

      const message =
        error instanceof Error ? error.message : "Could not delete goal.";

      feedback.error(message);

      throw error;
    }
  }

  const loadGoalsOverview = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await getGoalsOverview();

      setData(response);
    } catch (error) {
      console.warn(error);
      setErrorMessage("Could not load goals.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoalsOverview();
  }, [loadGoalsOverview]);

  function openCreateGoalModal() {
    setCreateGoalModalMode("create");
    setEditingGoal(null);
    setIsCreateGoalModalVisible(true);
  }

  function closeCreateGoalModal() {
    setIsCreateGoalModalVisible(false);
    setEditingGoal(null);
    setCreateGoalModalMode("create");
  }

  function openEditGoalModal(goal: GoalOverviewItem) {
    setSelectedGoal(null);
    setIsGoalDetailsModalVisible(false);

    setEditingGoal(goal);
    setCreateGoalModalMode("edit");
    setIsCreateGoalModalVisible(true);
  }

  function handleAddContribution(goal: GoalOverviewItem) {
    setIsGoalDetailsModalVisible(false);

    setTransactionInitialValues({
      type: "income",
      goalId: goal.id,
      description: `Contribution to ${goal.name}`,
      notes: `Goal contribution · ${goal.name}`,
    });

    setIsCreateTransactionModalVisible(true);
  }

  async function handleDeleteContribution(
    goal: GoalOverviewItem,
    contribution: GoalContributionItem,
  ) {
    try {
      await deleteGoalContribution(goal.id, contribution.id);
      await loadGoalsOverview();

      feedback.success("Contribution removed successfully.");
    } catch (error) {
      console.warn(error);

      const message =
        error instanceof Error
          ? error.message
          : "Could not remove contribution.";

      feedback.error(message);

      throw error;
    }
  }

  function closeCreateTransactionModal() {
    setIsCreateTransactionModalVisible(false);
    setTransactionInitialValues(null);
  }

  async function handleContributionCreated() {
    await loadGoalsOverview();

    setIsCreateTransactionModalVisible(false);
    setTransactionInitialValues(null);
  }

  const totalSaved = data?.summary.totalSaved ?? 0;
  const totalTarget = data?.summary.totalTarget ?? 0;
  const globalProgress = data?.summary.globalProgress ?? 0;
  const totalMonthlyNeeded = data?.summary.monthlyNeeded ?? 0;
  const mainGoal = data?.mainGoal ?? null;
  const goals = data?.goals ?? [];

  return (
    <View style={styles.screen}>
      <AppScreenHeader title="Goals" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.balanceRow}>
          <View style={styles.balanceColumn}>
            <Text style={styles.label}>Total Saved</Text>
            <Text style={styles.balance}>{formatCurrency(totalSaved)}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.balanceColumn}>
            <Text style={styles.label}>Target Amount</Text>
            <Text style={styles.expense}>{formatCurrency(totalTarget)}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${globalProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {isLoading
              ? "Loading goals..."
              : (errorMessage ??
                data?.summary.progressMessage ??
                "No goals yet.")}
          </Text>
        </View>

        {mainGoal ? (
          <Pressable
            style={styles.mainGoalCard}
            onPress={() => openGoalDetails(mainGoal)}
          >
            <View style={styles.mainGoalHeader}>
              <View style={styles.mainGoalTextWrap}>
                <Text style={styles.sectionEyebrow}>Main Goal</Text>
                <Text style={styles.mainGoalTitle} numberOfLines={1}>
                  {mainGoal.name}
                </Text>
              </View>

              <View style={styles.mainGoalIcon}>
                <Icon
                  name={(mainGoal.icon ?? "target") as never}
                  size={32}
                  color={BUTTON_GREEN}
                  strokeWidth={1.6}
                />
              </View>
            </View>

            <View style={styles.bigProgressRow}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressCircleValue}>
                  {mainGoal.progress}%
                </Text>
              </View>

              <View style={styles.mainGoalInfo}>
                <Text style={styles.goalAmount} numberOfLines={1}>
                  {formatCurrency(mainGoal.saved, mainGoal.currency)}
                </Text>

                <Text style={styles.goalMeta} numberOfLines={1}>
                  saved of {formatCurrency(mainGoal.target, mainGoal.currency)}
                </Text>

                <Text style={styles.goalMeta} numberOfLines={1}>
                  Target date · {formatGoalTargetDate(mainGoal.targetDate)}
                </Text>
              </View>
            </View>

            <View style={styles.mainProgressBar}>
              <View
                style={[
                  styles.mainProgressFill,
                  { width: `${Math.min(mainGoal.progress, 100)}%` },
                ]}
              />
            </View>
          </Pressable>
        ) : (
          <View style={styles.emptyMainGoalCard}>
            <Text style={styles.mainGoalTitle}>No goals yet</Text>
            <Text style={styles.goalMeta}>
              Create your first goal to start tracking your progress.
            </Text>
          </View>
        )}

        <View style={styles.paceCard}>
          <View style={styles.paceItem}>
            <View style={styles.smallIconBox}>
              <Icon name="calendar" size={23} color={TAB_GREEN} />
            </View>
            <Text style={styles.paceLabel}>Monthly Needed</Text>
            <Text style={styles.paceValue}>
              {formatCurrency(totalMonthlyNeeded)}
            </Text>
          </View>

          <View style={styles.paceSeparator} />

          <View style={styles.paceItem}>
            <View style={styles.smallIconBox}>
              <Icon name="income" size={23} color={TAB_GREEN} />
            </View>
            <Text style={styles.paceLabel}>Active Goals</Text>
            <Text style={styles.paceValue}>{goals.length}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Goals</Text>

          <Pressable style={styles.filterButton}>
            <Text style={styles.filterText}>Active</Text>
          </Pressable>
        </View>

        {goals.map((goal) => (
          <Pressable
            key={goal.id}
            style={styles.goalCard}
            onPress={() => openGoalDetails(goal)}
          >
            <View style={styles.goalTopRow}>
              <View style={styles.goalLeft}>
                <View style={styles.iconCircle}>
                  <Icon
                    name={(goal.icon ?? "target") as never}
                    size={30}
                    color={BUTTON_GREEN}
                    strokeWidth={1.2}
                  />
                </View>

                <View style={styles.goalTextContent}>
                  <Text style={styles.goalTitle} numberOfLines={1}>
                    {goal.name}
                  </Text>

                  <Text style={styles.goalSubtitle} numberOfLines={1}>
                    {formatGoalTargetDate(goal.targetDate)} · {goal.statusLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.percentBadge}>
                <Text style={styles.percentText}>{goal.progress}%</Text>
              </View>
            </View>

            <View style={styles.goalProgressBar}>
              <View
                style={[
                  styles.goalProgressFill,
                  { width: `${Math.min(goal.progress, 100)}%` },
                ]}
              />
            </View>

            <View style={styles.goalBottomRow}>
              <Text style={styles.goalSmallText} numberOfLines={1}>
                {formatCurrency(goal.saved, goal.currency)} saved
              </Text>

              <Text style={styles.goalSmallText} numberOfLines={1}>
                {formatCurrency(goal.target, goal.currency)}
              </Text>
            </View>
          </Pressable>
        ))}

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Icon name="money" size={38} color={BUTTON_GREEN} strokeWidth={1} />
          </View>

          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Smart tip</Text>
            <Text style={styles.tipText}>
              {mainGoal
                ? `You need around ${formatCurrency(
                    mainGoal.monthlyNeeded,
                    mainGoal.currency,
                  )} per month to reach your ${mainGoal.name.toLowerCase()} goal on time.`
                : "Create a goal to receive simple progress tips."}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={openCreateGoalModal}>
        <Icon name="plus" size={30} color={WHITE} strokeWidth={1.8} />
      </Pressable>

      <LinearGradient
        pointerEvents="none"
        colors={["rgba(223, 247, 239, 0)", "rgba(223, 247, 239, 0.96)"]}
        style={styles.bottomFade}
      />

      <CreateGoalModal
        visible={isCreateGoalModalVisible}
        mode={createGoalModalMode}
        goal={editingGoal}
        onClose={closeCreateGoalModal}
        onSubmit={handleCreateGoal}
        onUpdate={handleUpdateGoal}
      />

      <GoalDetailsModal
        visible={isGoalDetailsModalVisible}
        goal={selectedGoal}
        onClose={closeGoalDetails}
        onEdit={openEditGoalModal}
        onDelete={handleDeleteGoal}
        onAddContribution={handleAddContribution}
        onDeleteContribution={handleDeleteContribution}
      />

      <CreateTransactionModal
        visible={isCreateTransactionModalVisible}
        onClose={closeCreateTransactionModal}
        onCreated={handleContributionCreated}
        initialValues={transactionInitialValues}
        lockType={Boolean(transactionInitialValues?.goalId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 142,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    gap: 30,
  },

  balanceColumn: {
    minWidth: 104,
    alignItems: "center",
  },

  label: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: BLACK,
    opacity: 0.72,
    marginBottom: 4,
  },

  balance: {
    fontSize: 24,
    lineHeight: 29,
    fontFamily: fonts.bold,
    color: DARK_GREEN,
  },

  expense: {
    fontSize: 24,
    lineHeight: 29,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  separator: {
    width: 1,
    height: 48,
    backgroundColor: "rgba(6, 59, 58, 0.18)",
  },

  progressContainer: {
    alignItems: "center",
    marginBottom: 34,
  },

  progressBar: {
    height: 16,
    borderRadius: 10,
    width: "88%",
    backgroundColor: DIVIDER_GREEN,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: TAB_GREEN,
  },

  progressText: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
    opacity: 0.86,
    textAlign: "center",
  },

  mainGoalCard: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  mainGoalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },

  mainGoalTextWrap: {
    flex: 1,
  },

  sectionEyebrow: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
    opacity: 0.68,
  },

  mainGoalTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 4,
  },

  mainGoalIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: CARD_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  bigProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  progressCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 5,
    borderColor: "rgba(16, 185, 146, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    backgroundColor: WHITE,
  },

  progressCircleValue: {
    fontSize: 21,
    fontFamily: fonts.bold,
    color: TAB_GREEN,
  },

  mainGoalInfo: {
    flex: 1,
  },

  goalAmount: {
    fontSize: 23,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  goalMeta: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
    opacity: 0.74,
    marginTop: 4,
  },

  mainProgressBar: {
    height: 9,
    borderRadius: 10,
    backgroundColor: CARD_GREEN,
    overflow: "hidden",
  },

  mainProgressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: TAB_GREEN,
  },

  paceCard: {
    flexDirection: "row",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  paceItem: {
    flex: 1,
    alignItems: "center",
  },

  smallIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  paceLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
    opacity: 0.72,
  },

  paceValue: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 4,
  },

  paceSeparator: {
    width: 1,
    backgroundColor: "rgba(6, 59, 58, 0.12)",
    marginHorizontal: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: BLACK,
    paddingBottom: 4,
  },

  filterButton: {
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },

  filterText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  goalCard: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  goalTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  goalLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: CARD_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  goalTextContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  goalTitle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  goalSubtitle: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: BLACK,
    opacity: 0.66,
    marginTop: 5,
    lineHeight: 15,
  },

  percentBadge: {
    minWidth: 52,
    height: 31,
    borderRadius: 16,
    backgroundColor: CARD_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  percentText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  goalProgressBar: {
    height: 8,
    borderRadius: 8,
    backgroundColor: CARD_GREEN,
    overflow: "hidden",
    marginTop: 14,
  },

  goalProgressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: TAB_GREEN,
  },

  goalBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 9,
  },

  goalSmallText: {
    flexShrink: 1,
    fontSize: 11,
    fontFamily: fonts.medium,
    color: BLACK,
    opacity: 0.68,
  },

  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 18,
    padding: 16,
    marginTop: 8,
  },

  tipIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: CARD_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
    marginBottom: 4,
  },

  tipText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
    lineHeight: 18,
    opacity: 0.8,
  },

  fab: {
    position: "absolute",
    right: 28,
    bottom: 116,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(16, 185, 146, 0.32)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    zIndex: 2,
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 122,
  },

  emptyMainGoalCard: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 20,
    padding: 22,
    marginBottom: 14,
    minHeight: 150,
    alignItems: "center",
    justifyContent: "center",
  },
});
