import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { deleteTransaction } from "@/features/transactions/services/transactions.service";

import {
  TransactionsOverviewResponse,
  TransactionOverviewItem,
} from "@repo/shared-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/app/lib/api/client";
import { getFilteredTransactionGroups } from "../utils/transactions";
import { formatCurrency } from "../utils/formatters";
import { TransactionsGroupedList } from "../components/transactions-grouped-list/TransactionsGroupedList";
import { CategoryFilterModal } from "../components/category-filter-modal/CategoryFilterModal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CreateTransactionModal } from "../components/create-transaction-modal/CreateTransactionModal";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { CalendarFilterModal } from "../components/calendar-filter-modal/CalendarFilterModal";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const GREEN = "#dff7ef";
const DARK_GREEN = "#063b3a";
const LIGHT_GREEN = "#fbfffd";
const WHITE = "#ffffff";
const BLACK = "#063b3a";
const TAB_GREEN = "#a9efdf";
const MINT = "#00c896";
const MUTED = "#5e7b78";
const SHADOW = "rgba(29, 100, 89, 0.12)";

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export default function TransactionScreen() {
  function handleEditTransaction(transaction: TransactionOverviewItem) {
    setTransactionToEdit(transaction);
    setIsCreateTransactionModalVisible(true);
  }

  const [transactionToEdit, setTransactionToEdit] =
    useState<TransactionOverviewItem | null>(null);

  async function handleDeleteTransaction(transactionId: string) {
    try {
      await deleteTransaction(transactionId);
      feedback.success("Transaction deleted successfully");
    } catch (error) {
      console.warn(error);
      feedback.error("Error deleting transaction");
    }
  }

  const [data, setData] = useState<TransactionsOverviewResponse | null>(null);
  const [totalsFilter, setTotalsFilter] = useState<
    "all" | "income" | "expense"
  >("all");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isCreateTransactionModalVisible, setIsCreateTransactionModalVisible] =
    useState(false);
  const [isCalendarFilterModalVisible, setIsCalendarFilterModalVisible] =
    useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const hasSelectedDateRange =
    Boolean(selectedDateRange.startDate) || Boolean(selectedDateRange.endDate);

  const filteredGroups = useMemo(
    () =>
      getFilteredTransactionGroups(
        data,
        totalsFilter,
        selectedCategoryIds,
        selectedDateRange,
      ),
    [data, totalsFilter, selectedCategoryIds, selectedDateRange],
  );

  const loadTransactions = useCallback(async () => {
    try {
      const response = await apiFetch<TransactionsOverviewResponse>(
        "/transactions/overview",
      );

      setData(response);
    } catch (error) {
      console.warn(error);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions]),
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Icon name="arrowLeft" size={24} strokeWidth={2.5} color={BLACK} />
        </Pressable>
        <Text style={styles.title}>Transactions</Text>
        <View style={styles.notifications}>
          <Icon name="bell" size={24} strokeWidth={1.8} color={BLACK} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
            <View
              style={[
                styles.incomeIcon,
                totalsFilter === "income" && styles.totalIconActive,
              ]}
            >
              <Icon
                name="income"
                size={22}
                strokeWidth={1.4}
                color={totalsFilter === "income" ? WHITE : MINT}
              />
            </View>
            <Text
              style={[
                styles.label,
                totalsFilter === "income" && styles.labelActive,
              ]}
            >
              Income
            </Text>
            <Text
              style={[
                styles.expense,
                totalsFilter === "income" && styles.totalLabelActive,
              ]}
            >
              {data ? formatCurrency(data.summary.totalIncome) : "$0.00"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              setTotalsFilter((prev) =>
                prev === "expense" ? "all" : "expense",
              )
            }
            style={[
              styles.totalCard,
              totalsFilter === "expense" && styles.totalCardActive,
            ]}
          >
            <View
              style={[
                styles.incomeIcon,
                totalsFilter === "expense" && styles.totalIconActive,
              ]}
            >
              <Icon
                name="expense"
                size={22}
                strokeWidth={1.4}
                color={totalsFilter === "expense" ? WHITE : MINT}
              />
            </View>
            <Text
              style={[
                styles.label,
                totalsFilter === "expense" && styles.labelActive,
              ]}
            >
              Expense
            </Text>
            <Text
              style={[
                styles.expense,
                totalsFilter === "expense" && styles.totalLabelActive,
              ]}
            >
              {data ? formatCurrency(data.summary.totalExpense) : "$0.00"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.cardWrapper}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>Transactions</Text>

            <View style={styles.listHeaderActions}>
              <Pressable
                onPress={() => setIsCategoryModalVisible(true)}
                style={[
                  styles.listHeaderIconButton,
                  selectedCategoryIds.length > 0 &&
                    styles.listHeaderIconButtonActive,
                ]}
              >
                <FontAwesome
                  size={15}
                  name="tags"
                  color={selectedCategoryIds.length > 0 ? WHITE : DARK_GREEN}
                />
              </Pressable>

              <Pressable
                onPress={() => setIsCalendarFilterModalVisible(true)}
                style={[
                  styles.listHeaderIconButton,
                  hasSelectedDateRange && styles.listHeaderIconButtonActive,
                ]}
              >
                <Icon
                  name="calendar"
                  size={21}
                  strokeWidth={1.8}
                  color={hasSelectedDateRange ? WHITE : DARK_GREEN}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.cardContent}>
            <TransactionsGroupedList
              groups={filteredGroups}
              onChanged={loadTransactions}
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={handleEditTransaction}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.floatingAddMoreButton}>
        <Pressable
          style={styles.floatingAddButton}
          onPress={() => {
            setTransactionToEdit(null);
            setIsCreateTransactionModalVisible(true);
          }}
        >
          <Icon size={34} strokeWidth={1.2} name="plus" color={BLACK} />
        </Pressable>
      </View>

      <CategoryFilterModal
        visible={isCategoryModalVisible}
        selectedCategoryIds={selectedCategoryIds}
        onClose={() => setIsCategoryModalVisible(false)}
        onApply={setSelectedCategoryIds}
      />

      <CalendarFilterModal
        visible={isCalendarFilterModalVisible}
        selectedRange={selectedDateRange}
        onClose={() => setIsCalendarFilterModalVisible(false)}
        onApply={(range) => {
          setSelectedDateRange(range);
        }}
      />

      <CreateTransactionModal
        visible={isCreateTransactionModalVisible}
        transactionToEdit={transactionToEdit}
        onClose={() => {
          setIsCreateTransactionModalVisible(false);
          setTransactionToEdit(null);
        }}
        onCreated={loadTransactions}
      />
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
    backgroundColor: GREEN,
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
    color: BLACK,
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

  content: {
    paddingHorizontal: 20,
    paddingBottom: 132,
  },

  balanceCard: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  balanceCardLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    textAlign: "center",
    color: MUTED,
    marginBottom: 5,
  },

  balanceCardTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fonts.bold,
    textAlign: "center",
    color: BLACK,
  },

  label: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
  },

  expense: {
    marginTop: 2,
    fontSize: 17,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  incomeIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: MINT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  totalIconActive: {
    backgroundColor: MINT,
    borderColor: MINT,
  },

  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 22,
  },

  totalCard: {
    flex: 1,
    minHeight: 104,
    borderRadius: 13,
    backgroundColor: LIGHT_GREEN,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  totalCardActive: {
    backgroundColor: TAB_GREEN,
  },

  labelActive: {
    color: BLACK,
    fontFamily: fonts.semibold,
  },

  totalLabelActive: {
    color: BLACK,
  },

  cardWrapper: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  cardHeaderTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  listHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  listHeaderIconButton: {
    width: 33,
    height: 33,
    borderRadius: 10,
    backgroundColor: TAB_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  listHeaderIconButtonActive: {
    backgroundColor: MINT,
  },

  cardContent: {
    paddingBottom: 2,
  },

  transactionIconBubble: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#e2f8f0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },

  floatingAddMoreButton: {
    position: "absolute",
    right: 24,
    bottom: 112,
    zIndex: 10,
  },

  floatingAddButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: TAB_GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: SHADOW,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 122,
  },
});
