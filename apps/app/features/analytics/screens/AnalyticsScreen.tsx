import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { useAnalytics } from "../hooks/useAnalytics";
import { getChartMaxValue, getChartYAxisLabels, normalizeChartBars } from "../utils/chart";
import { router } from "expo-router";

const TEAL = "#00c896";
const DARK_TEAL = "#063b3a";
const MID_TEAL = "#68e1c6";
const SOFT_TEAL = "#a9efdf";
const VERY_SOFT_TEAL = "#dff7ef";
const CARD = "#fbfffd";
const WHITE = "#ffffff";
const MUTED = "#5e7b78";
const GRID = "rgba(6, 59, 58, 0.09)";

function TargetCard({ percent, title, amountLeft }: { percent: string; title: string; amountLeft: string }) {
  return (
    <View style={styles.targetCard}>
      <View style={styles.ringTrack}>
        <View style={styles.ringArc} />
        <Text style={styles.progressValue}>{percent}</Text>
      </View>
      <Text style={styles.targetLabel}>{title}</Text>
      <Text style={styles.targetAmount}>{amountLeft}</Text>
    </View>
  );
}

export default function AnalyticsScreen() {
  const { selected, setSelected, data } = useAnalytics();
  const chartBars = data
    ? normalizeChartBars(data.chart.labels, data.chart.income, data.chart.expense, 112)
    : [];

  const maxValue = data
    ? getChartMaxValue(data.chart.income, data.chart.expense)
    : 1;

  const yAxisLabels = getChartYAxisLabels(maxValue);
  const isYearlyChart = selected === "yearly" || chartBars.length > 6;
  const yearlyChartWidth = Math.max(chartBars.length * 42, 310);

  function getBarLabel(label: string) {
    return isYearlyChart && label.length > 3 ? label.slice(0, 3) : label;
  }

  function formatCurrency(amount: string, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(Number(amount));
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Icon name="arrowLeft" size={24} strokeWidth={2.5} color={DARK_TEAL} />
        </Pressable>
        <Text style={styles.title}>Analytics</Text>
        <View style={styles.notifications}>
          <Icon name="bell" size={24} strokeWidth={1.8} color={DARK_TEAL} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceRow}>
          <View style={styles.balanceColumn}>
            <Text style={styles.label}>Total Balance</Text>
            <Text style={styles.balance}>
              {data ? formatCurrency(data.summary.totalBalance) : "$0.00"}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.balanceColumn}>
            <Text style={styles.label}>Total Expense</Text>
            <Text style={styles.balance}>
              {data ? `-${formatCurrency(data.summary.totalExpense)}` : "-$0.00"}
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(data?.summary.expenseRatio ?? 0, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {data?.summary.progressMessage ?? "0% of your income has been spent."}
          </Text>
        </View>

        <View style={styles.segmentedControl}>
          {[
            ["daily", "Daily"],
            ["weekly", "Weekly"],
            ["monthly", "Monthly"],
            ["yearly", "Yearly"],
          ].map(([value, label]) => (
            <Pressable
              key={value}
              onPress={() => setSelected(value as "daily" | "weekly" | "monthly" | "yearly")}
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

        <View style={styles.graphicCard}>
          <View style={styles.graphHeader}>
            <Text style={styles.graphTitle}>Income & Expenses</Text>

            <View style={styles.graphActions}>
              <Pressable style={styles.graphIcon}>
                <Icon name="search" size={23} strokeWidth={1.8} color={DARK_TEAL} />
              </Pressable>

              <Pressable style={styles.graphIcon}>
                <Icon name="calendar" size={23} strokeWidth={1.8} color={DARK_TEAL} />
              </Pressable>
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
                    <View key={item.label} style={[styles.barGroup, styles.yearlyBarGroup]}>
                      <View style={[styles.barPair, styles.yearlyBarPair]}>
                        <View style={[styles.barIncome, styles.yearlyBar, { height: item.income }]} />
                        <View style={[styles.barExpense, styles.yearlyBar, { height: item.expense }]} />
                      </View>
                      <Text numberOfLines={1} style={[styles.barLabel, styles.yearlyBarLabel]}>
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
                        <View style={[styles.barIncome, { height: item.income }]} />
                        <View style={[styles.barExpense, { height: item.expense }]} />
                      </View>
                      <Text style={styles.barLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.totalsRow}>
          <View style={styles.totalItem}>
            <View style={styles.totalIcon}>
              <Icon name="income" size={27} strokeWidth={1.4} color={TEAL} />
            </View>
            <Text style={styles.totalLabel}>Income</Text>
            <Text style={styles.totalValue}>
              {data ? formatCurrency(data.summary.totalIncome) : "$0.00"}
            </Text>
          </View>

          <View style={styles.totalItem}>
            <View style={styles.totalIcon}>
              <Icon name="expense" size={27} strokeWidth={1.4} color={TEAL} />
            </View>
            <Text style={styles.totalLabel}>Expense</Text>
            <Text style={styles.totalValue}>
              {data ? formatCurrency(data.summary.totalExpense) : "$0.00"}
            </Text>
          </View>
        </View>

        <Text style={styles.targetsTitle}>My Targets</Text>

        <View style={styles.targetsRow}>
          <TargetCard percent="30%" title="Short term goal" amountLeft="$13,560.30 left" />
          <TargetCard percent="50%" title="Long term goal" amountLeft="$22,600.50 left" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: VERY_SOFT_TEAL,
  },

  headerArea: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 24,
    marginTop: 26,
    marginBottom: 22,
  },

  title: {
    textAlign: "center",
    fontSize: 19,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
  },

  notifications: {
    width: 42,
    height: 42,
    backgroundColor: CARD,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 118,
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
    backgroundColor: CARD,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
    marginBottom: 14,
  },

  graphHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  graphTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
  },

  graphActions: {
    flexDirection: "row",
    gap: 10,
  },

  graphIcon: {
    width: 33,
    height: 33,
    backgroundColor: SOFT_TEAL,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  chartLabels: {
    width: 30,
    height: 158,
    justifyContent: "space-between",
    paddingBottom: 19,
  },

  chartYAxis: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  chartContent: {
    flex: 1,
    height: 158,
    position: "relative",
  },

  chartGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
    justifyContent: "space-between",
  },

  gridLine: {
    borderTopWidth: 1,
    borderTopColor: GRID,
    borderStyle: "dashed",
  },

  chartBarsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 158,
    paddingLeft: 8,
    paddingRight: 2,
  },

  barGroup: {
    alignItems: "center",
    justifyContent: "flex-end",
  },

  barPair: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 9,
    height: 116,
    marginBottom: 10,
  },

  barIncome: {
    width: 12,
    borderRadius: 8,
    backgroundColor: TEAL,
  },

  barExpense: {
    width: 12,
    borderRadius: 8,
    backgroundColor: "#c7f5df",
  },

  barLabel: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: DARK_TEAL,
  },

  yearlyChartBarsRow: {
    justifyContent: "space-between",
    paddingLeft: 6,
    paddingRight: 8,
  },

  yearlyBarGroup: {
    width: 34,
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

  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  totalItem: {
    width: "48%",
    minHeight: 102,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CARD,
    borderRadius: 13,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  totalIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderColor: TEAL,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },

  totalLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: DARK_TEAL,
  },

  totalValue: {
    marginTop: 2,
    fontSize: 17,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
  },

  targetsTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
    marginBottom: 16,
  },

  targetsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  targetCard: {
    width: "48%",
    backgroundColor: SOFT_TEAL,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  ringTrack: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 5,
    borderColor: "rgba(0, 200, 150, 0.24)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
  },

  ringArc: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 5,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: TEAL,
    borderRightColor: TEAL,
    transform: [{ rotate: "28deg" }],
  },

  progressValue: {
    fontSize: 19,
    fontFamily: fonts.bold,
    color: TEAL,
  },

  targetLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: DARK_TEAL,
  },

  targetAmount: {
    marginTop: 3,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: DARK_TEAL,
  },
});
