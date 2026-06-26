import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { deleteTransaction } from "@/features/transactions/services/transactions.service";

import {
  TransactionsOverviewResponse,
  TransactionOverviewItem,
} from "@repo/shared-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { getFilteredTransactionGroups } from "../utils/transactions";
import { TransactionsGroupedList } from "../components/transactions-grouped-list/TransactionsGroupedList";
import { CategoryFilterModal } from "../components/category-filter-modal/CategoryFilterModal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CreateTransactionModal } from "../components/create-transaction-modal/CreateTransactionModal";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { CalendarFilterModal } from "../components/calendar-filter-modal/CalendarFilterModal";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";
import { formatCurrency } from "@/utils/formatCurrency";
import { t } from "@/lib/i18n";

const GREEN = "#dff7ef";
const DARK_GREEN = "#063b3a";
const LIGHT_GREEN = "#fbfffd";
const WHITE = "#ffffff";
const BLACK = "#063b3a";
const TAB_GREEN = "#a9efdf";
const MINT = "#00c896";
const MUTED = "#5e7b78";
const SHADOW = "rgba(29, 100, 89, 0.12)";
const BUTTON_GREEN = "#10b992";
const LIGHT_GRAY = "rgba(0, 0, 0, 0.1)";
const DESKTOP_BREAKPOINT = 768;
const DESKTOP_CONTENT_WIDTH = 1040;

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export default function TransactionScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const tabBarHeight = useBottomTabBarHeight();
  const contentBottomPadding = isDesktop ? 36 : tabBarHeight + 36;
  const floatingButtonBottom = tabBarHeight + 26;
  const bottomFadeHeight = isDesktop ? 0 : tabBarHeight + 32;

  function handleEditTransaction(transaction: TransactionOverviewItem) {
    setTransactionToEdit(transaction);
    setIsCreateTransactionModalVisible(true);
  }

  const [transactionToEdit, setTransactionToEdit] =
    useState<TransactionOverviewItem | null>(null);

  async function handleDeleteTransaction(transactionId: string) {
    try {
      await deleteTransaction(transactionId);
      feedback.success(t("transactions.feedback.deleteSuccess"));
    } catch (error) {
      console.warn(error);
      feedback.error(t("transactions.feedback.deleteError"));
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
      <AppScreenHeader title={t("transactions.title")} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: contentBottomPadding },
          isDesktop && styles.contentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.balanceCard, isDesktop && styles.balanceCardDesktop]}
        >
          <Text style={styles.balanceCardLabel}>
            {t("transactions.totalBalance")}
          </Text>
          <Text style={styles.balanceCardTitle}>
            {data ? formatCurrency(data.summary.totalBalance) : "€0.00"}
          </Text>
        </View>

        <View style={[styles.totalsRow, isDesktop && styles.totalsRowDesktop]}>
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
              {t("transactions.income")}
            </Text>
            <Text
              style={[
                styles.expense,
                totalsFilter === "income" && styles.totalLabelActive,
              ]}
            >
              {data ? formatCurrency(data.summary.totalIncome) : "€0.00"}
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
              {t("transactions.expense")}
            </Text>
            <Text
              style={[
                styles.expense,
                totalsFilter === "expense" && styles.totalLabelActive,
              ]}
            >
              {data ? formatCurrency(data.summary.totalExpense) : "€0.00"}
            </Text>
          </Pressable>
        </View>

        <View
          style={[styles.cardWrapper, isDesktop && styles.cardWrapperDesktop]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>
              {t("transactions.title")}
            </Text>

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

              {isDesktop && (
                <Pressable
                  onPress={() => {
                    setTransactionToEdit(null);
                    setIsCreateTransactionModalVisible(true);
                  }}
                  style={styles.listHeaderIconButton}
                >
                  <Icon
                    name="plus"
                    size={22}
                    strokeWidth={1.8}
                    color={DARK_GREEN}
                  />
                </Pressable>
              )}

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
              isDesktop={isDesktop}
              onChanged={loadTransactions}
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={handleEditTransaction}
            />
          </View>
        </View>
      </ScrollView>

      {!isDesktop && (
        <Pressable
          style={[styles.floatingAddButton, { bottom: floatingButtonBottom }]}
          onPress={() => {
            setTransactionToEdit(null);
            setIsCreateTransactionModalVisible(true);
          }}
        >
          <Icon name="plus" size={30} color={WHITE} strokeWidth={1.8} />
        </Pressable>
      )}

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
        style={[styles.bottomFade, { height: bottomFadeHeight }]}
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
  },

  contentDesktop: {
    width: "100%",
    maxWidth: DESKTOP_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 32,
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

  balanceCardDesktop: {
    paddingVertical: 30,
    marginBottom: 20,
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

  totalsRowDesktop: {
    gap: 20,
    marginBottom: 28,
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

  cardWrapperDesktop: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 16,
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

  floatingAddButton: {
    position: "absolute",
    right: 28,
    bottom: 116,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    borderColor: LIGHT_GRAY,
    borderWidth: 1,
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
});
