import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { useAnalytics } from "../hooks/useAnalytics";
import { getChartMaxValue, getChartYAxisLabels, normalizeChartBars } from "../utils/chart";

const GREEN = "#00c896";
const DIVIDER_GREEN = "#00d09e";
const DARK_GREEN = "#059669";
const LIGHT_GREEN = "#f1fff3";
const MEDIUM_GREEN = "#dff7e2";
const LIGTH_GRAY = "rgba(0,0,0,0.1)";
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const TAB_GREEN = "#14cfa1";


export default function AnalyticsScreen() {
  const { selected, setSelected, data, loading } = useAnalytics(); 
  const chartBars = data
    ? normalizeChartBars(data.chart.labels, data.chart.income, data.chart.expense, 90)
    : [];

  const maxValue = data
    ? getChartMaxValue(data.chart.income, data.chart.expense)
    : 1;

  const yAxisLabels = getChartYAxisLabels(maxValue); 

  function formatCurrency(amount: string, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(Number(amount));
  }

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Icon name="back" size={22} strokeWidth={2.5} color={WHITE} />
        <Text style={styles.title}>Analytics</Text>
        <View style={styles.notifications}>
          <Icon name="bell" size={28} strokeWidth={1.5} color={BLACK} />
        </View>
      </View>

      <View style={styles.balanceRow}>
        <View>
          <Text style={styles.label}>Total Balance</Text>
          <Text style={styles.balance}>
            {data ? formatCurrency(data.summary.totalBalance) : "$0.00"}
          </Text>
        </View>

        <View style={styles.separator} />

        <View>
          <Text style={styles.label}>Total Expense</Text>
          <Text style={styles.expense}>
            {data ? `-${formatCurrency(data.summary.totalExpense)}` : "-$0.00"}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(data?.summary.expenseRatio ?? 0, 100)}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {data?.summary.progressMessage ?? "Loading analytics..."}
        </Text>
      </View>

      <View style={styles.cardWrapper}>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
        >

        <View style={styles.segmentedControl}>
          <Pressable
            onPress={() => setSelected("daily")}
            style={[
              styles.segmentItem,
              selected === "daily" && styles.segmentItemActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                selected === "daily" && styles.segmentTextActive,
              ]}
            >
              Daily
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelected("weekly")}
            style={[
              styles.segmentItem,
              selected === "weekly" && styles.segmentItemActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                selected === "weekly" && styles.segmentTextActive,
              ]}
            >
              Weekly
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelected("monthly")}
            style={[
              styles.segmentItem,
              selected === "monthly" && styles.segmentItemActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                selected === "monthly" && styles.segmentTextActive,
              ]}
            >
              Monthly
            </Text>
          </Pressable>

           <Pressable
            onPress={() => setSelected("yearly")}
            style={[
              styles.segmentItem,
              selected === "yearly" && styles.segmentItemActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                selected === "yearly" && styles.segmentTextActive,
              ]}
            >
              Yearly
            </Text>
          </Pressable>
        </View>

          <View style={styles.graphicCard}>
            <View style={styles.graphHeader}>
              <Text style={styles.graphTitle}>Income & Expenses</Text>

              <View style={styles.graphActions}>
                <Pressable style={styles.graphIcon}>
                  <Icon 
                  name="search"
                  size={26} />
                </Pressable>

                <Pressable style={styles.graphIcon}>
                  <Icon 
                  name="calendar"
                  size={26} />
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
              </View>
            </View>
          </View>

          <View style={styles.totalsRow}>
            <View style={styles.totalItem}>
              <View style={styles.totalIncomeIcon}>
                <Icon name="income" size={26} strokeWidth={1} color={TAB_GREEN} />
              </View>
              <Text style={styles.totalLabel}>Income</Text>
              <Text style={styles.totalIncome}>
                {data ? formatCurrency(data.summary.totalIncome) : "$0.00"}
              </Text>
            </View>

            <View style={styles.totalItem}>
              <View style={styles.totalExpenseIcon}>
                <Icon name="expense" size={26} strokeWidth={1} color={DARK_GREEN} />
              </View>
              <Text style={styles.totalLabel}>Expense</Text>
              <Text style={styles.totalExpense}>
                {data ? formatCurrency(data.summary.totalExpense) : "$0.00"}
              </Text>
            </View>
          </View>

          <Text style={styles.targetsTitle}>My Targets</Text>

          <View style={styles.targetsRow}>
            <View style={styles.targetCard}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressValue}>30%</Text>
              </View>
              <Text style={styles.targetLabel}>Travel</Text>
            </View>

            <View style={styles.targetCard}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressValue}>50%</Text>
              </View>
              <Text style={styles.targetLabel}>Car</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  headerArea: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 50,
    marginBottom: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  notifications: {
    backgroundColor: WHITE,
    padding: 3,
    borderRadius: 100,
  },

  cardWrapper: {
    flex: 1,
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    paddingTop: 40,
    overflow: "hidden",
  },

  cardContent: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 120,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    gap: 30,
  },

  label: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
  },

  balance: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: WHITE,
  },

  expense: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  separator: {
    width: 1,
    backgroundColor: "#d1fae5",
  },

  progressContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  progressBar: {
    height: 20,
    borderRadius: 10,
    width: "70%",
    backgroundColor: "#d1fae5",
    overflow: "hidden",
  },

  progressFill: {
    width: "30%",
    height: "100%",
    backgroundColor: BLACK,
  },

  progressText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  graphicCard: {
    backgroundColor: MEDIUM_GREEN,
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
  },

  graphHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  graphTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  graphActions: {
    flexDirection: "row",
    gap: 8,
  },

  graphIcon: {
    backgroundColor: TAB_GREEN,
    padding: 4,
    borderRadius: 10,
  },

  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  chartLabels: {
    width: 28,
    height: 150,
    justifyContent: "space-between",
    paddingBottom: 18,
  },

  chartYAxis: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: "#6b8f87",
  },

  chartContent: {
    flex: 1,
    height: 150,
    position: "relative",
  },

  chartGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 18,
    justifyContent: "space-between",
  },

  gridLine: {
    borderTopWidth: 1,
    borderTopColor: "#b5ddd5",
    borderStyle: "dashed",
  },

  chartBarsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    paddingLeft: 4,
    paddingRight: 2,
  },

  barGroup: {
    alignItems: "center",
    justifyContent: "flex-end",
  },

  barPair: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: 112,
    marginBottom: 8,
  },

  barIncome: {
    width: 6,
    borderRadius: 4,
    backgroundColor: TAB_GREEN,
  },

  barExpense: {
    width: 6,
    borderRadius: 4,
    backgroundColor: DARK_GREEN,
  },

  barLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 18,
  },

  totalItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  totalIncomeIcon: {
    borderColor: TAB_GREEN,
    borderWidth: 1,
    borderRadius: 8
  },


  totalExpenseIcon: {
    borderColor: DARK_GREEN,
    borderWidth: 1,
    borderRadius: 8
  },

  totalLabel: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
  },

  totalIncome: {
    marginTop: 2,
    fontSize: 16,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  totalExpense: {
    marginTop: 2,
    fontSize: 16,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  targetsTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
    marginBottom: 14,
  },

  targetsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  targetCard: {
    width: "47%",
    backgroundColor: DIVIDER_GREEN,
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  progressCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  progressValue: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: WHITE,
  },

  targetLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: WHITE,
  },

  segmentedControl: {
    backgroundColor: "#d7ead9",
    borderRadius: 18,
    padding: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  segmentItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 14,
  },

  segmentItemActive: {
    backgroundColor: "#14cfa1",
  },

  segmentText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  segmentTextActive: {
    fontFamily: fonts.bold,
  },
});