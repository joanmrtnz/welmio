import { Pressable, StyleSheet, Text, View } from "react-native";
import { fonts } from "@/theme/fonts";

const CARD = "#ffffff";
const CARD_SOFT = "#f3fbf8";
const GREEN = "#0bb894";
const GREEN_DARK = "#078a73";
const TEXT = "#063436";
const MUTED = "#6f8790";
const BORDER = "rgba(9, 169, 130, 0.12)";
const GRID = "rgba(6, 52, 54, 0.08)";
const EXPENSE = "#9ee8d6";

type AnalyticsPoint = {
  label: string;
  income: number;
  expense: number;
};

type QuickAnalyticsCardProps = {
  title?: string;
  actionLabel?: string;
  data: AnalyticsPoint[];
  onPress?: () => void;
};

const CHART_MAX_HEIGHT = 96;

function formatCompactAmount(value: number) {
  if (value >= 1000) {
    const amount = value / 1000;
    return Number.isInteger(amount) ? `€${amount}K` : `€${amount.toFixed(1)}K`;
  }

  return `€${Math.round(value)}`;
}

function getMaxValue(data: AnalyticsPoint[]) {
  const values = data.flatMap((item) => [item.income, item.expense]);
  return Math.max(...values, 1);
}

function normalizeHeight(value: number, maxValue: number) {
  return Math.max(Math.round((value / maxValue) * CHART_MAX_HEIGHT), 8);
}

export function QuickAnalyticsCard({
  title = "Last week chart",
  actionLabel = "Analytics",
  data,
  onPress,
}: QuickAnalyticsCardProps) {
  const maxValue = getMaxValue(data);
  const middleValue = maxValue / 2;

  return (
    <Pressable disabled={!onPress} onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Income vs expenses</Text>
        </View>

        <View style={styles.actionPill}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </View>
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

      <View style={styles.chartRow}>
        <View style={styles.axisColumn}>
          <Text style={styles.axisText}>{formatCompactAmount(maxValue)}</Text>
          <Text style={styles.axisText}>{formatCompactAmount(middleValue)}</Text>
          <Text style={styles.axisText}>$0</Text>
        </View>

        <View style={styles.chartBody}>
          <View style={styles.gridLayer}>
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
          </View>

          <View style={styles.barsRow}>
            {data.map((item) => (
              <View key={item.label} style={styles.barGroup}>
                <View style={styles.barColumns}>
                  <View
                    style={[
                      styles.bar,
                      styles.incomeBar,
                      { height: normalizeHeight(item.income, maxValue) },
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      styles.expenseBar,
                      { height: normalizeHeight(item.expense, maxValue) },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 18,
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    marginBottom: 22,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },

  title: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  subtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  actionPill: {
    minHeight: 30,
    borderRadius: 999,
    backgroundColor: CARD_SOFT,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  actionText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.bold,
    color: GREEN_DARK,
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
    backgroundColor: GREEN,
  },

  expenseDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: EXPENSE,
  },

  legendText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  chartRow: {
    flexDirection: "row",
    marginTop: 16,
    minHeight: 142,
  },

  axisColumn: {
    width: 34,
    height: 116,
    justifyContent: "space-between",
    paddingTop: 2,
    paddingBottom: 19,
  },

  axisText: {
    fontSize: 10,
    lineHeight: 13,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  chartBody: {
    flex: 1,
    height: 128,
    position: "relative",
    justifyContent: "flex-end",
  },

  gridLayer: {
    ...StyleSheet.absoluteFillObject,
    height: 102,
    justifyContent: "space-between",
    paddingBottom: 10,
  },

  gridLine: {
    height: 1,
    backgroundColor: GRID,
  },

  barsRow: {
    height: 128,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },

  barGroup: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 26,
  },

  barColumns: {
    height: 104,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },

  bar: {
    width: 8,
    borderRadius: 999,
  },

  incomeBar: {
    backgroundColor: GREEN,
  },

  expenseBar: {
    backgroundColor: EXPENSE,
  },

  barLabel: {
    marginTop: 9,
    fontSize: 10,
    lineHeight: 13,
    fontFamily: fonts.medium,
    color: MUTED,
  },
});
