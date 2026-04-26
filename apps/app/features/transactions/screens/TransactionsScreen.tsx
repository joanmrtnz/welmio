import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { TransactionsOverviewResponse } from "@repo/shared-types";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/app/lib/api/client";
import { formatCategoryLabel, formatCurrency, formatSignedAmount, formatTransactionMeta } from "../utils/formatters";
import { getFilteredTransactionGroups } from "../utils/transactions";


const GREEN = "#00c896";
const DIVIDER_GREEN = "#00d09e";
const DARK_GREEN = "#059669";
const LIGHT_GREEN = "#f1fff3";
const MEDIUM_GREEN = "#23C988"
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const BUTTON_GREEN = "#1A9E6A";
const LIGTH_GRAY = "rgba(0,0,0,0.1)";
const TAB_GREEN = "#14cfa1";



export default function TransactionScreen() {
  const [data, setData] = useState<TransactionsOverviewResponse | null>(null);
  const [totalsFilter, setTotalsFilter] = useState<"all" | "income" | "expense">("all");

  const filteredGroups = useMemo(() => {
    return getFilteredTransactionGroups(data, totalsFilter);
  }, [data, totalsFilter]);
 
  useEffect(() => {
    async function loadTransactions() {
      try {
        const response = await apiFetch<TransactionsOverviewResponse>(
          "/transactions/overview",
        );
        setData(response);
      } catch (error) {
        console.warn(error);
      }
    }

    loadTransactions();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Icon name="back" size={18} color={WHITE} />
        <Text style={styles.title}>Transactions</Text>
        <View style={styles.notifications}>
          <Icon name="bell" />
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceCardLabel}>Total Balance</Text>
        <Text style={styles.balanceCardTitle}>
          {data ? formatCurrency(data.summary.totalBalance) : "$0.00"}
        </Text>
      </View>

      <View style={styles.totalsRow}>
        <Pressable
          onPress={() =>
            setTotalsFilter((prev) => (prev === "income" ? "all" : "income"))
          }
          style={[
            styles.totalCard,
            totalsFilter === "income" && styles.totalCardActive,
          ]}
        >
          <View style={[
            styles.incomeIcon,
            totalsFilter === "income" && styles.totalIconActive]
            }>
             <Icon name="income" size={22} color={totalsFilter === "income" ? WHITE : BLACK}/>
          </View>
          <Text style={[
            styles.label, 
             totalsFilter === "income" && styles.labelActive,
          ]}>Income</Text>
           <Text style={[
            styles.expense,
            totalsFilter === "income" && styles.totalLabelActive]}>
            {data ? formatCurrency(data.summary.totalIncome) : "$0.00"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setTotalsFilter((prev) => (prev === "expense" ? "all" : "expense"))
          }
          style={[
            styles.totalCard,
            totalsFilter === "expense" && styles.totalCardActive,
          ]}
        >
          <View style={[
            styles.incomeIcon,
            totalsFilter === "expense" && styles.totalIconActive]
            }>
             <Icon name="expense" size={22} color={totalsFilter === "expense" ? WHITE : BLACK}/>
          </View>
           <Text style={[
            styles.label, 
             totalsFilter === "expense" && styles.labelActive,
          ]}>Expense</Text>
          <Text style={[
            styles.expense,
            totalsFilter === "expense" && styles.totalLabelActive]}>
            {data ? formatCurrency(data.summary.totalExpense) : "$0.00"}
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.calendarFloatingButton}>
          <Icon 
          name="calendar"
          size={26} />
      </Pressable>

      <View style={styles.cardWrapper}>
        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredGroups.map((group) => (
            <View key={group.month}>
              <Text style={styles.monthLabel}>{group.month}</Text>

              {group.items.map((item) => (
                <View key={item.id} style={styles.transactionRow}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.icon}>
                      <Icon
                        name={(item.category.icon ?? "money") as never}
                        size={25}
                        color={BUTTON_GREEN}
                      />
                    </Text>
                  </View>

                  <View style={styles.transactionInfo}>
                    <Text
                      style={styles.transactionTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.description}
                    </Text>
                    <Text style={styles.transactionMeta}>
                      {formatTransactionMeta(item.date)}
                    </Text>
                  </View>

                  <View style={styles.categoryColumn}>
                    <Text style={styles.transactionCategory}>
                      {formatCategoryLabel(
                        item.category.name,
                        item.frequencyType,
                        item.transactionNature,
                      )}
                    </Text>
                  </View>

                  <View style={styles.amountColumn}>
                    <Text
                      style={
                        item.type === "expense"
                          ? styles.amountNegative
                          : styles.amountPositive
                      }
                    >
                      {formatSignedAmount(item.amount, item.type, item.currency)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
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
    paddingHorizontal: 38,
    paddingVertical: 10,
    marginTop: 50,
    marginBottom: 20,
  },

  title: {
    textAlign: 'center',
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
    paddingTop: 20,
    overflow: "hidden",
  },

  cardContent: {
   paddingHorizontal: 32,
    paddingTop: 30,
    paddingBottom: 120
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
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  separator: {
    width: 1,
    backgroundColor: "#d1fae5",
  },


  balanceCard: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 10,
    padding: 16,
    gap: 5,
    textAlign: "center",
    justifyContent: "center",
    marginVertical: 20,
    marginHorizontal: 30,
  },

  balanceCardLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "center",
    color: BLACK,
  },

  balanceCardTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    textAlign: "center",
    color: BLACK,
  },

  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  amountPositive: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  amountNegative: {
    fontSize: 12,
    fontFamily: fonts.bold,
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

incomeIcon: {
  borderColor: BLACK,
  borderWidth: 2,
  borderRadius: 5,
},

totalIconActive: {
  borderColor: WHITE,
  borderWidth: 1,
},

monthLabel: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: BLACK,
},


transactionRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 14,
},

transactionInfo: {
  flex: 1,
  marginLeft: 12,
  marginRight: 10,
},

transactionTitle: {
  fontSize: 12,
  fontFamily: fonts.medium,
  color: BLACK,
},

transactionMeta: {
  fontSize: 11,
  fontFamily: fonts.regular,
  color: BLACK,
  marginTop: 5,
},

categoryColumn: {
  height: 32,
  width: 80,
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "center",
  borderLeftColor: DIVIDER_GREEN,
  borderLeftWidth: 1,
  borderRightColor: DIVIDER_GREEN,
  borderRightWidth: 1,
},

amountColumn: {
  width: 90,
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "center",
},

transactionCategory: {
  fontSize: 11,
  fontFamily: fonts.medium,
  color: BLACK,
  textAlign: "center",
},

totalCard: {
  width: "40%",
  backgroundColor: "#ffffff",
  borderRadius: 20,
  paddingVertical: 16,
  paddingHorizontal: 82,
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  borderColor: WHITE,
  borderWidth: 1,
},

totalCardActive: {
  backgroundColor: DARK_GREEN,
  borderColor: LIGTH_GRAY,
  borderWidth: 1,
},

labelActive: {
  color: WHITE,
  fontFamily: fonts.semibold,

},

totalLabelActive: {
  color: WHITE,
},

totalsRow: {
  marginHorizontal: 20,
  flexDirection: "row",
  justifyContent: "space-around",
  marginBottom: 18,
},

calendarFloatingButton: {
  position: "absolute",
  top: 405,
  right: 28,
  width: 35,
  height: 35,
  borderRadius: 12,
  backgroundColor: TAB_GREEN,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  elevation: 6,
},

});

