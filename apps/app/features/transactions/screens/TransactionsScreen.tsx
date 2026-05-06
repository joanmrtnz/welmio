import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import {
  deleteTransaction,
  updateTransaction,
} from "@/features/transactions/services/transactions.service";

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

const GREEN = "#dff7ef";
const DARK_GREEN = "#09a982";
const LIGHT_GREEN = "#f7fffb";
const WHITE = "#ffffff";
const BLACK = "#0b3437";
const LIGTH_GRAY = "rgba(11,52,55,0.08)";
const TAB_GREEN = "#95e4cb";
const MINT = "#12c79b";
const SHADOW = "rgba(29, 100, 89, 0.14)";

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

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions]),
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrowLeft" size={22} strokeWidth={2.5} color={BLACK} />
        </Pressable>
        <Text style={styles.title}>Transactions</Text>
        <View style={styles.notifications}>
          <Icon name="bell" size={28} strokeWidth={1.5} color={BLACK} />
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
          <View
            style={[
              styles.incomeIcon,
              totalsFilter === "income" && styles.totalIconActive,
            ]}
          >
            <Icon
              name="income"
              size={18}
              color={totalsFilter === "income" ? WHITE : BLACK}
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
            setTotalsFilter((prev) => (prev === "expense" ? "all" : "expense"))
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
              size={18}
              color={totalsFilter === "expense" ? WHITE : BLACK}
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

      <View style={styles.floatingAddMoreButton}>
        <Pressable
          style={styles.floatingAddButton}
          onPress={() => {
            setTransactionToEdit(null);
            setIsCreateTransactionModalVisible(true);
          }}
        >
          <Icon size={35} strokeWidth={1} name="plus" color={BLACK} />
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
                size={19}
                strokeWidth={2}
                color={hasSelectedDateRange ? WHITE : DARK_GREEN}
              />
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
        >
          <TransactionsGroupedList
            groups={filteredGroups}
            onChanged={loadTransactions}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
          />
        </ScrollView>

        <LinearGradient
          pointerEvents="none"
          colors={[
            "rgba(241,255,243,0)",
            "rgba(241,255,243,0.82)",
            LIGHT_GREEN,
          ]}
          locations={[0, 0.58, 1]}
          style={styles.cardBottomFade}
        />
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
    marginTop: 44,
    marginBottom: 16,
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  notifications: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: SHADOW,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  cardWrapper: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: WHITE,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingTop: 30,
    overflow: "hidden",
    shadowColor: SHADOW,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    marginBottom: 14,
  },

  cardHeaderTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  listHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  listHeaderIconButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: TAB_GREEN,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },

  listHeaderIconButtonActive: {
    backgroundColor: DARK_GREEN,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    gap: 30,
  },

  label: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: BLACK,
  },

  balance: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: WHITE,
  },

  expense: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  separator: {
    width: 1,
    backgroundColor: "#d1fae5",
  },

  balanceCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 16,
    gap: 8,
    justifyContent: "center",
    marginVertical: 14,
    marginHorizontal: 26,
    shadowColor: SHADOW,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  balanceCardLabel: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: "center",
    color: BLACK,
  },

  balanceCardTitle: {
    fontSize: 28,
    fontFamily: fonts.bold,
    textAlign: "center",
    color: BLACK,
  },

  incomeIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: MINT,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },

  totalIconActive: {
    backgroundColor: "rgba(255,255,255,0.22)",
  },

  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginHorizontal: 24,
    marginBottom: 30,
  },

  totalCard: {
    flex: 1,
    minHeight: 120,
    borderRadius: 17,
    backgroundColor: WHITE,
    paddingVertical: 17,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    shadowColor: SHADOW,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },

  totalCardActive: {
    backgroundColor: DARK_GREEN,
    borderColor: LIGTH_GRAY,
  },

  labelActive: {
    color: WHITE,
    fontFamily: fonts.semibold,
  },

  totalLabelActive: {
    color: WHITE,
  },

  floatingAddMoreButton: {
    position: "absolute",
    right: 24,
    bottom: 118,
    zIndex: 12,
  },

  floatingAddButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: TAB_GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: SHADOW,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  cardContent: {
    paddingHorizontal: 26,
    paddingTop: 4,
    paddingBottom: 178,
  },

  cardBottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 170,
    zIndex: 6,
  },
});
