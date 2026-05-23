import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { useAnalytics } from "../hooks/useAnalytics";
import {
  getChartMaxValue,
  getChartYAxisLabels,
  normalizeChartBars,
} from "../utils/chart";
import { LinearGradient } from "expo-linear-gradient";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";
import { formatCurrency } from "@/utils/formatCurrency";
import { useExpensesByCategoryAnalytics } from "../hooks/useExpensesByCategoryAnalytics";
import type { ExpenseCategoryChartItem } from "../hooks/useExpensesByCategoryAnalytics";
import { useGoalContributionsAnalytics } from "../hooks/useGoalContributionsAnalytics";
import type { GoalContributionChartItem } from "../hooks/useGoalContributionsAnalytics";

const TEAL = "#00c896";
const DARK_TEAL = "#063b3a";
const CARD_SOFT = "#f3fbf8";
const GREEN_DARK = "#078a73";
const MID_TEAL = "#68e1c6";
const SOFT_TEAL = "#a9efdf";
const VERY_SOFT_TEAL = "#dff7ef";
const CARD = "#fbfffd";
const WHITE = "#ffffff";
const MUTED = "#5e7b78";
const GRID = "rgba(6, 59, 58, 0.09)";
const DESKTOP_BREAKPOINT = 768;
const DESKTOP_CONTENT_WIDTH = 1040;

const PERIOD_LABELS = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
} as const;

type AnalyticsPeriod = keyof typeof PERIOD_LABELS;

function PeriodBadge({ label }: { label: string }) {
  return (
    <View style={styles.periodBadge}>
      <Text style={styles.periodBadgeText}>{label}</Text>
    </View>
  );
}

function ExpensesByCategoryCard({
  categories,
  isDesktop,
  isLoading,
  hasError,
  periodLabel,
}: {
  categories: ExpenseCategoryChartItem[];
  isDesktop?: boolean;
  isLoading: boolean;
  hasError: boolean;
  periodLabel: string;
}) {
  const showEmptyState = !isLoading && !hasError && categories.length === 0;

  return (
    <View style={[styles.graphicCard, isDesktop && styles.graphicCardDesktop]}>
      <View style={styles.graphHeader}>
        <View style={styles.graphTitleWrap}>
          <Text style={styles.graphTitle}>Expenses by Category</Text>
          <Text style={styles.graphSubtitle}>Distribution by category</Text>
        </View>
        <PeriodBadge label={periodLabel} />
      </View>

      {isLoading ? (
        <View style={styles.chartStateBox}>
          <Text style={styles.chartStateTitle}>Loading expenses...</Text>
          <Text style={styles.chartStateText}>
            Getting your category totals for this period.
          </Text>
        </View>
      ) : hasError ? (
        <View style={styles.chartStateBox}>
          <Text style={styles.chartStateTitle}>Could not load categories</Text>
          <Text style={styles.chartStateText}>
            Try changing the period or refreshing the screen.
          </Text>
        </View>
      ) : showEmptyState ? (
        <View style={styles.chartStateBox}>
          <Text style={styles.chartStateTitle}>No expenses yet</Text>
          <Text style={styles.chartStateText}>
            Add expense transactions to see this chart.
          </Text>
        </View>
      ) : (
        <View style={styles.categoryChartList}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryChartItem}>
              <View style={styles.categoryChartTopRow}>
                <Text style={styles.categoryLabel}>{category.label}</Text>
                <Text style={styles.categoryAmount}>
                  {formatCurrency(category.amount)}
                </Text>
              </View>
              <View style={styles.horizontalBarTrack}>
                <View
                  style={[
                    styles.horizontalBarFill,
                    {
                      width: `${category.percent}%`,
                      backgroundColor: TEAL,
                    },
                  ]}
                />
              </View>
              <Text style={styles.categoryPercent}>
                {category.percent}% of expenses · {category.transactionsCount}{" "}
                {category.transactionsCount === 1
                  ? "transaction"
                  : "transactions"}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function GoalContributionsCard({
  goals,
  isDesktop,
  isLoading,
  hasError,
  periodLabel,
}: {
  goals: GoalContributionChartItem[];
  isDesktop?: boolean;
  isLoading: boolean;
  hasError: boolean;
  periodLabel: string;
}) {
  const showEmptyState = !isLoading && !hasError && goals.length === 0;

  return (
    <View style={[styles.graphicCard, isDesktop && styles.graphicCardDesktop]}>
      <View style={styles.graphHeader}>
        <View style={styles.graphTitleWrap}>
          <Text style={styles.graphTitle}>Goal Contributions</Text>
          <Text style={styles.graphSubtitle}>
            Contributions received by goal
          </Text>
        </View>
        <PeriodBadge label={periodLabel} />
      </View>

      {isLoading ? (
        <View style={styles.chartStateBox}>
          <Text style={styles.chartStateTitle}>Loading contributions...</Text>
          <Text style={styles.chartStateText}>
            Getting your goal contribution totals for this period.
          </Text>
        </View>
      ) : hasError ? (
        <View style={styles.chartStateBox}>
          <Text style={styles.chartStateTitle}>Could not load goals</Text>
          <Text style={styles.chartStateText}>
            Try changing the period or refreshing the screen.
          </Text>
        </View>
      ) : showEmptyState ? (
        <View style={styles.chartStateBox}>
          <Text style={styles.chartStateTitle}>No contributions yet</Text>
          <Text style={styles.chartStateText}>
            Add goal contributions to see this chart.
          </Text>
        </View>
      ) : (
        <View style={styles.goalContributionList}>
          {goals.map((goal) => (
            <View key={goal.id} style={styles.goalContributionItem}>
              <View style={styles.goalContributionHeader}>
                <View style={styles.goalRingTrack}>
                  <View style={[styles.goalRingArc, { borderColor: TEAL }]} />
                  <Text style={styles.goalRingText}>{goal.percent}%</Text>
                </View>
                <View style={styles.goalContributionInfo}>
                  <Text style={styles.goalContributionTitle}>{goal.label}</Text>
                  <Text style={styles.goalContributionAmount}>
                    {formatCurrency(goal.amount)} contributed
                  </Text>
                  <View style={styles.horizontalBarTrack}>
                    <View
                      style={[
                        styles.goalBarFill,
                        {
                          width: `${goal.percent}%`,
                          backgroundColor: TEAL,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.goalContributionMeta}>
                    {goal.percent}% of goal contributions ·{" "}
                    {goal.contributionsCount}{" "}
                    {goal.contributionsCount === 1
                      ? "contribution"
                      : "contributions"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function AnalyticsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const { selected, setSelected, data } = useAnalytics();
  const chartBars = data
    ? normalizeChartBars(
        data.chart.labels,
        data.chart.income,
        data.chart.expense,
        112,
      )
    : [];

  const maxValue = data
    ? getChartMaxValue(data.chart.income, data.chart.expense)
    : 1;

  const yAxisLabels = getChartYAxisLabels(maxValue);
  const isYearlyChart =
    (selected === "yearly" || chartBars.length > 6) && !isDesktop;
  const yearlyChartWidth = Math.max(chartBars.length * 42, 310);
  const selectedPeriod = selected as AnalyticsPeriod;
  const selectedPeriodLabel = PERIOD_LABELS[selectedPeriod] ?? "Daily";
  const {
    categories: expenseCategories,
    isLoading: isLoadingExpenseCategories,
    error: expenseCategoriesError,
  } = useExpensesByCategoryAnalytics({ period: selectedPeriod });
  const {
    goals: goalContributions,
    isLoading: isLoadingGoalContributions,
    error: goalContributionsError,
  } = useGoalContributionsAnalytics({ period: selectedPeriod });

  function getVisibleBarHeight(height: number) {
    return Math.max(height, 8);
  }

  function getBarLabel(label: string) {
    return isYearlyChart && label.length > 3 ? label.slice(0, 3) : label;
  }

  return (
    <View style={styles.screen}>
      <AppScreenHeader title="Analytics" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isDesktop && styles.contentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.balanceRow, isDesktop && styles.balanceRowDesktop]}
        >
          <View style={styles.balanceColumn}>
            <Text style={styles.label}>Total Balance</Text>
            <Text style={styles.balance}>
              {data ? formatCurrency(data.summary.totalBalance) : "€0.00"}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.balanceColumn}>
            <Text style={styles.label}>Total Expense</Text>
            <Text style={styles.balance}>
              {data
                ? `-${formatCurrency(data.summary.totalExpense)}`
                : "-€0.00"}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.progressContainer,
            isDesktop && styles.progressContainerDesktop,
          ]}
        >
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(data?.summary.expenseRatio ?? 0, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {data?.summary.progressMessage ??
              "0% of your income has been spent."}
          </Text>
        </View>

        <View
          style={[
            styles.segmentedControl,
            isDesktop && styles.segmentedControlDesktop,
          ]}
        >
          {[
            ["daily", "Daily"],
            ["weekly", "Weekly"],
            ["monthly", "Monthly"],
            ["yearly", "Yearly"],
          ].map(([value, label]) => (
            <Pressable
              key={value}
              onPress={() =>
                setSelected(value as "daily" | "weekly" | "monthly" | "yearly")
              }
              style={[
                styles.segmentItem,
                selected === value && styles.segmentItemActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  selected === value && styles.segmentTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={[styles.graphicCard, isDesktop && styles.graphicCardDesktop]}
        >
          <View style={styles.graphHeader}>
            <View style={styles.graphTitleWrap}>
              <Text style={styles.graphTitle}>Income & Expenses</Text>
              <Text style={styles.graphSubtitle}>Income vs expenses</Text>
            </View>

            <PeriodBadge label={selectedPeriodLabel} />
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.incomeDot} />
              <Text style={styles.legendText}>Income</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.expenseDot} />
              <Text style={styles.legendText}>Expense</Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            <View style={styles.chartLabels}>
              {yAxisLabels.map((label, index) => (
                <Text key={`${label}-${index}`} style={styles.chartYAxis}>
                  {label}
                </Text>
              ))}
            </View>

            <View style={styles.chartContent}>
              <View style={styles.chartGrid}>
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
                <View style={styles.gridLine} />
              </View>

              {isYearlyChart ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.chartBarsRow,
                    styles.yearlyChartBarsRow,
                    { width: yearlyChartWidth },
                  ]}
                >
                  {chartBars.map((item) => (
                    <View
                      key={item.label}
                      style={[styles.barGroup, styles.yearlyBarGroup]}
                    >
                      <View style={[styles.barPair, styles.yearlyBarPair]}>
                        <View
                          style={[
                            styles.barIncome,
                            styles.yearlyBar,
                            { height: getVisibleBarHeight(item.income) },
                          ]}
                        />
                        <View
                          style={[
                            styles.barExpense,
                            styles.yearlyBar,
                            { height: getVisibleBarHeight(item.expense) },
                          ]}
                        />
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[styles.barLabel, styles.yearlyBarLabel]}
                      >
                        {getBarLabel(item.label)}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.chartBarsRow}>
                  {chartBars.map((item) => (
                    <View key={item.label} style={styles.barGroup}>
                      <View style={styles.barPair}>
                        <View
                          style={[
                            styles.barIncome,
                            { height: getVisibleBarHeight(item.income) },
                          ]}
                        />
                        <View
                          style={[
                            styles.barExpense,
                            { height: getVisibleBarHeight(item.expense) },
                          ]}
                        />
                      </View>
                      <Text style={styles.barLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <ExpensesByCategoryCard
          categories={expenseCategories}
          hasError={Boolean(expenseCategoriesError)}
          isDesktop={isDesktop}
          isLoading={isLoadingExpenseCategories}
          periodLabel={selectedPeriodLabel}
        />
        <GoalContributionsCard
          goals={goalContributions}
          hasError={Boolean(goalContributionsError)}
          isDesktop={isDesktop}
          isLoading={isLoadingGoalContributions}
          periodLabel={selectedPeriodLabel}
        />
      </ScrollView>
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(223, 247, 239, 0)", "rgba(223, 247, 239, 0.96)"]}
        style={styles.bottomFade}
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

  balanceRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    gap: 30,
  },

  balanceRowDesktop: {
    marginTop: 4,
    marginBottom: 28,
    gap: 56,
  },

  balanceColumn: {
    minWidth: 104,
    alignItems: "center",
  },

  label: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: MUTED,
    marginBottom: 4,
  },

  balance: {
    fontSize: 24,
    lineHeight: 29,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
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

  progressContainerDesktop: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },

  progressBar: {
    height: 16,
    borderRadius: 10,
    width: "88%",
    backgroundColor: SOFT_TEAL,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: TEAL,
    borderRadius: 10,
  },

  progressText: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: DARK_TEAL,
  },

  segmentedControl: {
    backgroundColor: CARD,
    borderRadius: 28,
    padding: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },

  segmentedControlDesktop: {
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
    marginBottom: 30,
  },

  segmentItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 22,
  },

  segmentItemActive: {
    backgroundColor: MID_TEAL,
  },

  segmentText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: DARK_TEAL,
  },

  segmentTextActive: {
    fontFamily: fonts.bold,
  },

  graphicCard: {
    backgroundColor: WHITE,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(9, 169, 130, 0.12)",
    padding: 18,
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    marginBottom: 22,
  },

  graphicCardDesktop: {
    padding: 24,
    marginBottom: 26,
  },

  graphHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },

  graphTitleWrap: {
    flex: 1,
  },

  graphTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
  },

  graphSubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 18,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  incomeDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: TEAL,
  },

  expenseDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: "#9ee8d6",
  },

  legendText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 2,
    minHeight: 142,
  },

  chartLabels: {
    width: 34,
    height: 116,
    justifyContent: "space-between",
    paddingTop: 2,
    paddingBottom: 19,
  },

  chartYAxis: {
    fontSize: 10,
    lineHeight: 13,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  chartContent: {
    flex: 1,
    height: 128,
    position: "relative",
    justifyContent: "flex-end",
  },

  chartGrid: {
    ...StyleSheet.absoluteFillObject,
    height: 102,
    justifyContent: "space-between",
    paddingBottom: 10,
  },

  gridLine: {
    height: 1,
    backgroundColor: GRID,
  },

  chartBarsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 128,
    paddingLeft: 8,
    paddingRight: 2,
    gap: 8,
  },

  barGroup: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 26,
  },

  barPair: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    height: 104,
    marginBottom: 9,
  },

  barIncome: {
    width: 8,
    borderRadius: 999,
    backgroundColor: TEAL,
  },

  barExpense: {
    width: 8,
    borderRadius: 999,
    backgroundColor: "#9ee8d6",
  },

  barLabel: {
    marginTop: 0,
    fontSize: 10,
    lineHeight: 13,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  yearlyChartBarsRow: {
    justifyContent: "space-between",
    paddingLeft: 6,
    paddingRight: 8,
  },

  yearlyBarGroup: {
    width: 34,
    flex: 0,
  },

  yearlyBarPair: {
    gap: 4,
  },

  yearlyBar: {
    width: 8,
  },

  yearlyBarLabel: {
    width: 34,
    textAlign: "center",
    fontSize: 9,
  },

  periodBadge: {
    minHeight: 30,
    borderRadius: 999,
    backgroundColor: CARD_SOFT,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  periodBadgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.bold,
    color: GREEN_DARK,
  },

  chartStateBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#f6fcfa",
    borderWidth: 1,
    borderColor: "rgba(9, 169, 130, 0.1)",
  },

  chartStateTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
  },

  chartStateText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  categoryChartList: {
    marginTop: 20,
    gap: 16,
  },

  categoryChartItem: {
    gap: 7,
  },

  categoryChartTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },

  categoryLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    fontFamily: fonts.medium,
    color: DARK_TEAL,
  },

  categoryAmount: {
    fontSize: 13,
    lineHeight: 17,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
  },

  horizontalBarTrack: {
    height: 10,
    width: "100%",
    borderRadius: 999,
    backgroundColor: "rgba(0, 200, 150, 0.14)",
    overflow: "hidden",
  },

  horizontalBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: TEAL,
  },

  categoryPercent: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  goalContributionList: {
    marginTop: 20,
    gap: 14,
  },

  goalContributionItem: {
    padding: 13,
    borderRadius: 20,
    backgroundColor: "#f6fcfa",
  },

  goalContributionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  goalRingTrack: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 5,
    borderColor: "rgba(0, 200, 150, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  goalRingArc: {
    position: "absolute",
    width: 58,
    height: 58,

    borderColor: TEAL,
  },

  goalRingText: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
  },

  goalContributionInfo: {
    flex: 1,
    gap: 7,
  },

  goalContributionTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
  },

  goalContributionAmount: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  goalContributionMeta: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  goalBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: TEAL,
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 122,
  },
});
