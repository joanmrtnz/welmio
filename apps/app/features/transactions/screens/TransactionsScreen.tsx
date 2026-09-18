import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { deleteTransaction } from "@/features/transactions/services/transactions.service";

import { TransactionOverviewItem } from "@repo/shared-types";
import { useRef, useState } from "react";
import { TransactionPagination } from "../components/transaction-pagination/TransactionPagination";
import { useTransactionBrowser } from "../hooks/useTransactionBrowser";
import { TransactionsGroupedList } from "../components/transactions-grouped-list/TransactionsGroupedList";
import { CategoryFilterModal } from "../components/category-filter-modal/CategoryFilterModal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CreateTransactionModal } from "../components/create-transaction-modal/CreateTransactionModal";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { CalendarFilterModal } from "../components/calendar-filter-modal/CalendarFilterModal";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";
import { formatCurrency } from "@/utils/formatCurrency";
import { i18n, t } from "@/lib/i18n";
import { formatPeriod } from "../utils/dateRange";
import { SkeletonText } from "@/components/ui/loading/Skeleton";
import { TransactionsListSkeleton } from "../components/transactions-list-skeleton/TransactionsListSkeleton";
import { ImportTransactionsModal } from "../components/import-transactions-modal/ImportTransactionsModal";
import { useImportTransactions } from "../hooks/useImportTransactions";

const GREEN = "#dff7ef";
const DARK_GREEN = "#063b3a";
const LIGHT_GREEN = "#fbfffd";
const WHITE = "#ffffff";
const BLACK = "#063b3a";
const TAB_GREEN = "#a9efdf";
const MINT = "#00c896";
const MUTED = "#5e7b78";
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

  const {
    data,
    isLoading,
    error,
    filters,
    updateFilters,
    loadTransactions,
    setPage,
    searchInput,
    setSearchInput,
    clearSearch,
  } = useTransactionBrowser();
  const [searchVisible, setSearchVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const listTop = useRef(0);
  const changePage = (page: number) => {
    setPage(page);
    scrollRef.current?.scrollTo({ y: listTop.current, animated: true });
  };
  const totalsFilter = filters.type;
  const selectedCategoryIds = filters.categoryIds;
  const selectedDateRange = filters.range;
  const setSelectedCategoryIds = (categoryIds: string[]) =>
    updateFilters({ categoryIds });
  const setSelectedDateRange = (range: DateRange) => updateFilters({ range });
  const toggleType = (type: "income" | "expense") =>
    updateFilters({ type: totalsFilter === type ? "all" : type });
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isCreateTransactionModalVisible, setIsCreateTransactionModalVisible] =
    useState(false);
  const [isCalendarFilterModalVisible, setIsCalendarFilterModalVisible] =
    useState(false);
  const hasSelectedDateRange =
    Boolean(selectedDateRange.startDate) || Boolean(selectedDateRange.endDate);

  const showInitialSkeleton = isLoading;
  const {
    preview: importPreview,
    pendingImport,
    isImporting,
    selectCsvFile,
    applyImportMapping,
    confirmImport,
    closeMapping,
    closePreview,
  } = useImportTransactions({ onImported: loadTransactions });

  return (
    <View style={styles.screen}>
      <AppScreenHeader title={t("transactions.title")} />

      <ScrollView
        ref={scrollRef}
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("transactions.calendarFilter.title")}
            onPress={() => setIsCalendarFilterModalVisible(true)}
            style={{ padding: 10 }}
          >
            <Text style={styles.periodLabel}>
              {formatPeriod(
                selectedDateRange,
                i18n.locale,
                t("transactions.browse.allTime"),
              )}{" "}
              ▾
            </Text>
          </Pressable>
          <Text style={styles.balanceCardLabel}>
            {t("transactions.browse.periodBalance")}
          </Text>
          {showInitialSkeleton ? (
            <SkeletonText width={128} height={28} />
          ) : (
            <Text style={styles.balanceCardTitle}>
              {!error && data ? formatCurrency(data.summary.totalBalance) : "—"}
            </Text>
          )}
        </View>

        <View style={[styles.totalsRow, isDesktop && styles.totalsRowDesktop]}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: totalsFilter === "income" }}
            onPress={() => toggleType("income")}
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
            {showInitialSkeleton ? (
              <SkeletonText
                width={84}
                height={18}
                style={styles.totalSkeleton}
              />
            ) : (
              <Text
                style={[
                  styles.expense,
                  totalsFilter === "income" && styles.totalLabelActive,
                ]}
              >
                {!error && data
                  ? formatCurrency(data.summary.totalIncome)
                  : "—"}
              </Text>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: totalsFilter === "expense" }}
            onPress={() => toggleType("expense")}
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
            {showInitialSkeleton ? (
              <SkeletonText
                width={84}
                height={18}
                style={styles.totalSkeleton}
              />
            ) : (
              <Text
                style={[
                  styles.expense,
                  totalsFilter === "expense" && styles.totalLabelActive,
                ]}
              >
                {!error && data
                  ? formatCurrency(data.summary.totalExpense)
                  : "—"}
              </Text>
            )}
          </Pressable>
        </View>

        <View
          onLayout={(event) => {
            listTop.current = event.nativeEvent.layout.y;
          }}
          style={[styles.cardWrapper, isDesktop && styles.cardWrapperDesktop]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>
              {t("transactions.title")}
            </Text>

            <View style={styles.listHeaderActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("transactions.browse.search")}
                accessibilityState={{ expanded: searchVisible }}
                style={[
                  styles.listHeaderIconButton,
                  searchVisible && styles.listHeaderIconButtonActive,
                ]}
                onPress={() => {
                  setSearchVisible((value) => !value);
                  if (searchVisible) clearSearch();
                }}
              >
                <FontAwesome
                  name="search"
                  size={18}
                  color={searchVisible ? WHITE : DARK_GREEN}
                />
              </Pressable>
              <Pressable
                onPress={selectCsvFile}
                style={styles.listHeaderIconButton}
                accessibilityRole="button"
                accessibilityLabel={t("transactions.import.button")}
              >
                <Icon
                  name="document"
                  size={21}
                  strokeWidth={1.6}
                  color={DARK_GREEN}
                />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("transactions.categoryFilter.title")}
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
                accessibilityRole="button"
                accessibilityLabel={t("transactions.calendarFilter.title")}
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

          {searchVisible && (
            <View style={styles.searchPanel}>
              <View style={styles.searchRow}>
                <TextInput
                  autoFocus
                  accessibilityLabel={t(
                    "transactions.browse.searchPlaceholder",
                  )}
                  placeholder={t("transactions.browse.searchPlaceholder")}
                  value={searchInput}
                  onChangeText={setSearchInput}
                  maxLength={200}
                  autoCorrect={false}
                  returnKeyType="search"
                  style={styles.searchInput}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t("transactions.browse.clearSearch")}
                  onPress={clearSearch}
                  style={styles.searchClear}
                >
                  <Icon name="close" size={16} color={DARK_GREEN} />
                </Pressable>
              </View>
              <Text style={styles.searchHint}>
                {formatPeriod(
                  selectedDateRange,
                  i18n.locale,
                  t("transactions.browse.allTime"),
                )}
              </Text>
              {hasSelectedDateRange && (
                <Pressable
                  accessibilityRole="button"
                  style={styles.searchScope}
                  onPress={() =>
                    setSelectedDateRange({ startDate: null, endDate: null })
                  }
                >
                  <Text style={styles.label}>
                    {t("transactions.browse.searchAllYears")}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
          {(totalsFilter !== "all" ||
            selectedCategoryIds.length > 0 ||
            Boolean(filters.search)) && (
            <Text style={styles.searchHint}>
              {t("transactions.browse.totalsHint")}
            </Text>
          )}
          <View style={styles.cardContent}>
            {error ? (
              <Pressable accessibilityRole="button" onPress={loadTransactions}>
                <Text style={styles.label}>
                  {t("transactions.browse.loadError")}
                </Text>
                <Text style={styles.label}>{t("common.retry")}</Text>
              </Pressable>
            ) : showInitialSkeleton ? (
              <TransactionsListSkeleton />
            ) : data?.pagination.total === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.label}>
                  {t(
                    filters.search ||
                      selectedCategoryIds.length ||
                      totalsFilter !== "all"
                      ? "transactions.browse.noMatches"
                      : "transactions.browse.emptyPeriod",
                  )}
                </Text>
                {(filters.search ||
                  selectedCategoryIds.length > 0 ||
                  totalsFilter !== "all") && (
                  <Pressable
                    accessibilityRole="button"
                    style={styles.searchScope}
                    onPress={() => {
                      clearSearch();
                      updateFilters({
                        type: "all",
                        categoryIds: [],
                        search: "",
                      });
                    }}
                  >
                    <Text style={styles.label}>
                      {t("transactions.browse.clearFilters")}
                    </Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <TransactionsGroupedList
                groups={data?.groups ?? []}
                isDesktop={isDesktop}
                onChanged={loadTransactions}
                onDeleteTransaction={handleDeleteTransaction}
                onEditTransaction={handleEditTransaction}
              />
            )}
          </View>
          {data && !error && (
            <TransactionPagination
              pagination={data.pagination}
              loading={isLoading}
              onPageChange={changePage}
            />
          )}
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
      <ImportTransactionsModal
        preview={importPreview}
        pendingImport={pendingImport}
        isImporting={isImporting}
        onClose={closePreview}
        onCloseMapping={closeMapping}
        onApplyMapping={applyImportMapping}
        onImport={confirmImport}
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

  periodLabel: {
    color: DARK_GREEN,
    fontFamily: fonts.semibold,
    textAlign: "center",
    fontSize: 15,
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

  totalSkeleton: {
    marginTop: 4,
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
    flexWrap: "wrap",
    gap: 12,
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
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: TAB_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  listHeaderIconButtonActive: {
    backgroundColor: MINT,
  },

  searchPanel: { gap: 8, marginBottom: 14 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  searchInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    borderWidth: 1,
    borderColor: TAB_GREEN,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: DARK_GREEN,
    backgroundColor: WHITE,
  },
  searchClear: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  searchHint: { fontSize: 12, color: MUTED, marginBottom: 8 },
  searchScope: {
    minHeight: 44,
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    backgroundColor: TAB_GREEN,
    borderRadius: 10,
  },
  emptyState: { paddingVertical: 24, gap: 12, alignItems: "center" },
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
