import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { apiFetch } from "@/app/lib/api/client";

const GREEN = "#00c896";
const DIVIDER_GREEN = "#00d09e";
const DARK_GREEN = "#059669";
const LIGHT_GREEN = "#f1fff3";
const MEDIUM_GREEN = "#23C988";
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const BUTTON_GREEN = "#1A9E6A";

type CategoryType = "income" | "expense";

type CategoriesOverviewResponse = {
  summary: {
    totalBalance: string;
    totalIncome: string;
    totalExpense: string;
    expenseRatio: number;
    progressMessage: string;
  };
  categories: {
    id: string;
    name: string;
    color?: string | null;
    icon?: string | null;
    type: CategoryType;
  }[];
};

function formatCurrency(amount: string, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount));
}

export default function CategoriesScreen() {
  const [data, setData] = useState<CategoriesOverviewResponse | null>(null);

  useEffect(() => {
    async function loadCategoriesOverview() {
      try {
        const response = await apiFetch<CategoriesOverviewResponse>(
          "/categories/overview",
        );
        setData(response);
      } catch (error) {
        console.warn(error);
      }
    }

    loadCategoriesOverview();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Icon name="arrowLeft" size={22} strokeWidth={2.5} color={BLACK} />
        <Text style={styles.title}>Categories</Text>
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
          {data?.summary.progressMessage ?? "Loading categories..."}
        </Text>
      </View>

      <View style={styles.cardWrapper}>
        <View style={styles.cardContent}>
          <View style={styles.grid}>
            {(data?.categories ?? []).map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <View style={styles.gridIcon}>
                  <Icon
                    name={(item.icon ?? "plus") as any}
                    size={65}
                    color={WHITE}
                  />
                </View>
                <Text style={styles.gridLabel}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
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
    paddingHorizontal: 32,
    paddingTop: 30,
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

  iconCircle: {
    width: 53,
    height: 53,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: MEDIUM_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gridItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 48,
  },

  gridIcon: {
    width: 95,
    height: 95,
    borderRadius: 22,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  gridLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: "#052e2b",
    textAlign: "center",
  },
});