import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { apiFetch } from "@/app/lib/api/client";
import type {
  GoalsOverviewResponse,
  TransactionsOverviewResponse,
} from "@repo/shared-types";
import { TransactionRow } from "@/features/transactions/components/transaction-row/TransactionRow";
import { QuickAnalyticsCard } from "@/features/analytics/components/QuickAnalyticsCard";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";
import { getGoalsOverview } from "@/features/goals/services/goals.service";
import { QuickGoalsRow } from "@/features/goals/components/quick-goals-row/QuickGoalsRow";
import { formatCurrency } from "@/utils/formatCurrency";
import { getUserProfile } from "@/features/profile/services/profile-service";
import { getGreetingLabel } from "./utils/getGreetingLabel";
import { AVATAR_IMAGES, type AvatarId } from "@/features/profile/components/AvatarPickerModal";

const SCREEN_BG = "#dff7ef";
const CARD = "#ffffff";
const CARD_SOFT = "#f3fbf8";
const MINT = "#d7f5eb";
const GREEN = "#0bb894";
const GREEN_DARK = "#078a73";
const TEXT = "#063436";
const MUTED = "#6f8790";
const DANGER = "#ff4265";
const BORDER = "rgba(9, 169, 130, 0.12)";
const LIGHT_GREEN = "#f8fffc";
const DESKTOP_BREAKPOINT = 768;
const DESKTOP_CONTENT_WIDTH = 1040;

const EMPTY_ANALYTICS_DATA = [
  { label: "Mon", income: 0, expense: 0 },
  { label: "Tue", income: 0, expense: 0 },
  { label: "Wed", income: 0, expense: 0 },
  { label: "Thu", income: 0, expense: 0 },
  { label: "Fri", income: 0, expense: 0 },
  { label: "Sat", income: 0, expense: 0 },
  { label: "Sun", income: 0, expense: 0 },
];


function isAvatarId(value: unknown): value is AvatarId {
  return typeof value === "string" && value in AVATAR_IMAGES;
}

function formatAnalyticsLabel(label: string) {
  const parsedDate = new Date(label);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleDateString("en-US", { weekday: "short" });
  }

  return label.length > 3 ? label.slice(0, 3) : label;
}

function SectionHeader({
  title,
  action,
  onActionPress,
}: {
  title: string;
  action?: string;
  onActionPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable
          disabled={!onActionPress}
          hitSlop={10}
          onPress={onActionPress}
        >
          <View style={styles.sectionActionContainer}>
            <Text style={styles.sectionAction}>{action}</Text>
            <Icon name="chevronRight" size={14} strokeWidth={1.8} color={GREEN_DARK} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const [transactionsOverview, setTransactionsOverview] =
    useState<TransactionsOverviewResponse | null>(null);
  const [goalsOverview, setGoalsOverview] =
    useState<GoalsOverviewResponse | null>(null);
  const [fullName, setFullName] = useState("");
  const [avatarId, setAvatarId] = useState<AvatarId>("avatar-0");
  const [goalsErrorMessage, setGoalsErrorMessage] = useState<string | null>(
    null,
  );

  const { selected, setSelected, data: analyticsData } = useAnalytics();

  const loadUserProfile = useCallback(async () => {
    try {
      const user = await getUserProfile();

      setFullName(user.fullName ?? "");
      setAvatarId(isAvatarId(user.avatarIcon) ? user.avatarIcon : "avatar-0");
    } catch (error) {
      console.warn("[HomeScreen] load user profile error:", error);
    }
  }, []);

  const recentTransactions = useMemo(
    () =>
      transactionsOverview?.groups
        .flatMap((group) => group.items)
        .slice(0, 3) ?? [],
    [transactionsOverview],
  );

  const homeGoals = useMemo(() => {
    const goals = goalsOverview?.goals ?? [];

    if (!goalsOverview?.mainGoal) {
      return goals.slice(0, 5);
    }

    const remainingGoals = goals.filter(
      (goal) => goal.id !== goalsOverview.mainGoal?.id,
    );

    return [goalsOverview.mainGoal, ...remainingGoals].slice(0, 5);
  }, [goalsOverview]);

  const weeklyAnalyticsData = useMemo(() => {
    if (!analyticsData?.chart.labels.length) {
      return EMPTY_ANALYTICS_DATA;
    }

    return analyticsData.chart.labels.map((label, index) => ({
      label: formatAnalyticsLabel(label),
      income: Number(analyticsData.chart.income[index] ?? 0),
      expense: Number(analyticsData.chart.expense[index] ?? 0),
    }));
  }, [analyticsData]);

  const selectedAvatarImage = AVATAR_IMAGES[avatarId];

  const totalBalance = transactionsOverview?.summary.totalBalance ?? 0;
  const totalExpense = transactionsOverview?.summary.totalExpense ?? 0;

  const loadTransactionsOverview = useCallback(async () => {
    try {
      const response = await apiFetch<TransactionsOverviewResponse>(
        "/transactions/overview",
      );

      setTransactionsOverview(response);
    } catch (error) {
      console.warn("[HomeScreen] load transactions overview error:", error);
    }
  }, []);

  const loadGoalsOverview = useCallback(async () => {
    try {
      setGoalsErrorMessage(null);

      const response = await getGoalsOverview();

      setGoalsOverview(response);
    } catch (error) {
      console.warn("[HomeScreen] load goals overview error:", error);
      setGoalsErrorMessage("Could not load goals.");
    }
  }, []);

  useEffect(() => {
    loadTransactionsOverview();
    loadGoalsOverview();
    loadUserProfile();
  }, [loadGoalsOverview, loadTransactionsOverview, loadUserProfile]);

  useEffect(() => {
    if (selected !== "weekly") {
      setSelected("weekly");
    }
  }, [selected, setSelected]);

  useFocusEffect(
    useCallback(() => {
      loadTransactionsOverview();
      loadGoalsOverview();
      loadUserProfile();
    }, [loadGoalsOverview, loadTransactionsOverview, loadUserProfile]),
  );

  return (
    <View style={styles.screen}>
       <View style={[styles.header, isDesktop && styles.headerDesktop]}>
          <View style={styles.userSide}>
            <Pressable
              style={styles.avatarFrame}
              hitSlop={10}
              onPress={() => router.push("/profile")}
            >
              <Image
                source={selectedAvatarImage}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </Pressable>

            <View>
             <Text style={styles.greeting}>Hi, {fullName || "User"}</Text>
              <Text style={styles.greetingSub}>{getGreetingLabel()}</Text>
            </View>
          </View>
          {/* { !isDesktop ? (
          <Pressable style={styles.notifications}>
            <Icon name="bell" size={24} strokeWidth={1.8} color={TEXT} />
          </Pressable>
          ):  <View></View>} */}
        </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
      >
        <SectionHeader title="Overview" />

        <View style={[styles.overviewRow, isDesktop && styles.overviewRowDesktop]}>
          <Pressable style={[styles.overviewCard, isDesktop && styles.overviewCardDesktop]}>
            <View style={styles.overviewIconWrap}>
              <Icon
                name="money"
                size={34}
                color={GREEN_DARK}
                strokeWidth={0.9}
              />
            </View>

            <View style={styles.overviewTextWrap}>
              <Text style={styles.overviewLabel}>Total Balance</Text>
              <Text style={styles.overviewPositive}>
                {formatCurrency(totalBalance)}
              </Text>
            </View>
          </Pressable>

          <Pressable style={[styles.overviewCard, isDesktop && styles.overviewCardDesktop]}>
            <View style={[styles.overviewIconWrap, styles.expenseIconWrap]}>
              <Icon name="expense" size={28} color={DANGER} strokeWidth={1.4} />
            </View>

            <View style={styles.overviewTextWrap}>
              <Text style={styles.overviewLabel}>Total Expense</Text>
              <Text style={styles.overviewAmount}>
                -{formatCurrency(totalExpense)}
              </Text>
            </View>
          </Pressable>
        </View>

        <SectionHeader
          title="Goals"
          action="View All"
          onActionPress={() => router.push("/goals")}
        />

        <QuickGoalsRow
          goals={homeGoals}
          errorMessage={goalsErrorMessage}
          onGoalPress={() => router.push("/goals")}
          onEmptyPress={() => router.push("/goals")}
        />

        <SectionHeader
          title="Analytics"
          action="View All"
          onActionPress={() => router.push("/analytics")}
        />

        <QuickAnalyticsCard
          data={weeklyAnalyticsData}
          title="This week chart"
          actionLabel="Weekly"
          onPress={() => router.push("/analytics")}
        />

        <SectionHeader
          title="Recent Transactions"
          action="View All"
          onActionPress={() => router.push("/transactions")}
        />

        <View style={styles.transactionsCard}>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                compact
                showCategory={false}
                withDivider={index !== recentTransactions.length - 1}
                onPress={() => router.push("/transactions")}
              />
            ))
          ) : (
            <Text style={styles.emptyTransactions}>
              No recent transactions yet.
            </Text>
          )}
        </View>
      </ScrollView>

      <LinearGradient
        pointerEvents="none"
        colors={["rgba(223, 247, 239, 0)", SCREEN_BG]}
        style={styles.bottomFade}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 132,
  },

  contentDesktop: {
    width: "100%",
    maxWidth: DESKTOP_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingBottom: 150,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 5,
    marginTop: 30,
    marginBottom: 18,
  },

  headerDesktop: {
    width: "100%",
    maxWidth: DESKTOP_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 32,
    marginTop: 24,
  },

  userSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatarFrame: {
    width: 47,
    height: 47,
    borderRadius: 25,
    backgroundColor: CARD,
    borderWidth: 5,
    borderColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  avatarImage: {
    width: 45,
    height: 45,
  },

  greeting: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  greetingSub: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 17,
    fontFamily: fonts.medium,
    color: MUTED,
  },


  notifications: {
    width: 42,
    height: 42,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 6,
  },

  sectionTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.bold,
    color: TEXT,
    paddingBottom: 2,
  },

  sectionActionContainer : {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  sectionAction: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.bold,
    color: GREEN_DARK,
  },

  overviewRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },

  overviewRowDesktop: {
    gap: 18,
  },

  overviewCard: {
    flex: 1,
    minHeight: 112,
    borderRadius: 26,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 15,
    justifyContent: "space-between",
    shadowColor: "rgba(29, 100, 89, 0.1)",
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },

  overviewCardDesktop: {
    minHeight: 128,
    padding: 20,
  },

  overviewIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: "center",
    justifyContent: "center",
  },

  expenseIconWrap: {
    backgroundColor: "#ffe7ed",
  },

  overviewTextWrap: {
    marginTop: 12,
  },

  overviewLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  overviewPositive: {
    marginTop: 3,
    fontSize: 19,
    lineHeight: 24,
    fontFamily: fonts.bold,
    color: GREEN_DARK,
  },

  overviewAmount: {
    marginTop: 3,
    fontSize: 19,
    lineHeight: 24,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  featureGoalCard: {
    borderRadius: 28,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 18,
    marginBottom: 12,
    shadowColor: "rgba(29, 100, 89, 0.1)",
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },

  featureGoalTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  bigGoalIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: MINT,
    alignItems: "center",
    justifyContent: "center",
  },

  featureGoalText: {
    flex: 1,
    minWidth: 0,
  },

  featureGoalTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  featureGoalMeta: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  goalProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 17,
  },

  progressTrack: {
    flex: 1,
    height: 11,
    borderRadius: 999,
    backgroundColor: CARD_SOFT,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: GREEN,
  },

  progressPercent: {
    width: 38,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.bold,
    color: GREEN_DARK,
    textAlign: "right",
  },

  goalsRow: {
    gap: 12,
    paddingRight: 18,
    paddingBottom: 2,
    marginBottom: 22,
  },

  goalMiniCard: {
    width: 265,
    minHeight: 96,
    borderRadius: 22,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  emptyGoalsCard: {
    minHeight: 82,
    borderRadius: 22,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 22,
  },

  goalMiniIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: "center",
    justifyContent: "center",
  },

  goalMiniContent: {
    flex: 1,
    minWidth: 0,
  },

  goalMiniTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  goalMiniMeta: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 15,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  miniProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },

  miniProgressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: CARD_SOFT,
    overflow: "hidden",
  },

  miniProgressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: GREEN,
  },

  goalMiniPercent: {
    width: 34,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.bold,
    color: GREEN_DARK,
    textAlign: "right",
  },

  transactionsCard: {
    borderRadius: 28,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 8,
    marginTop: 2,
    shadowColor: "rgba(29, 100, 89, 0.1)",
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },

  emptyTransactions: {
    paddingVertical: 22,
    paddingHorizontal: 18,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium,
    color: MUTED,
    textAlign: "center",
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 115,
  },
});
