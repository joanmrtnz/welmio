import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { TransactionsOverviewResponse } from "@repo/shared-types";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/app/lib/api/client";
import { getFilteredTransactionGroups } from "../utils/transactions";
import { formatCurrency } from "../utils/formatters";
import { TransactionsGroupedList } from "../components/TransactionsGroupedList";
import { CategoryFilterModal } from "../components/CategoryFilterModal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CreateTransactionModal } from "../components/CreateTransactionModal";


const GREEN = "#00c896";
const DARK_GREEN = "#059669";
const LIGHT_GREEN = "#f1fff3";
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const LIGTH_GRAY = "rgba(0,0,0,0.1)";
const TAB_GREEN = "#14cfa1";



export default function TransactionScreen() {
  const [data, setData] = useState<TransactionsOverviewResponse | null>(null);
  const [totalsFilter, setTotalsFilter] = useState<"all" | "income" | "expense">("all");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isCreateTransactionModalVisible, setIsCreateTransactionModalVisible] =
  useState(false);

  const filteredGroups = useMemo(() => {
    return getFilteredTransactionGroups(data, totalsFilter, selectedCategoryIds);
  }, [data, totalsFilter, selectedCategoryIds]);

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
             <Icon name="income" size={18} color={totalsFilter === "income" ? WHITE : BLACK}/>
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
             <Icon name="expense" size={18} color={totalsFilter === "expense" ? WHITE : BLACK}/>
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

     <View style={styles.floatingButtons}>
        <Pressable
          onPress={() => setIsCategoryModalVisible(true)}
          style={[
            styles.floatingButton,
            selectedCategoryIds.length > 0 && styles.floatingButtonActive,
          ]}
        >
           <FontAwesome size={16} name="tags" color={BLACK} />
        </Pressable>

        <Pressable style={styles.floatingButton}>
          <Icon name="calendar" size={26} />
        </Pressable>
      </View>

       <View style={styles.floatingAddMoreButton}>
        <Pressable 
        style={styles.floatingAddButton} 
        onPress={() => setIsCreateTransactionModalVisible(true)}>
           <Icon size={22} name="plus" color={BLACK} />
        </Pressable>
      </View>

      <View style={styles.cardWrapper}>
        <ScrollView 
        contentContainerStyle={styles.cardContent} 
        showsVerticalScrollIndicator={false}>
          <TransactionsGroupedList groups={filteredGroups} />
        </ScrollView>
      </View>

      <CategoryFilterModal
        visible={isCategoryModalVisible}
        selectedCategoryIds={selectedCategoryIds}
        onClose={() => setIsCategoryModalVisible(false)}
        onApply={setSelectedCategoryIds}
      />

      <CreateTransactionModal
        visible={isCreateTransactionModalVisible}
        onClose={() => setIsCreateTransactionModalVisible(false)}
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
    paddingHorizontal: 38,
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
    paddingTop: 20,
    overflow: "hidden",
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

  incomeIcon: {
    borderColor: BLACK,
    borderWidth: 2,
    borderRadius: 5,
  },

  totalIconActive: {
    borderColor: WHITE,
    borderWidth: 1,
  },

  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginHorizontal: 30,
    marginBottom: 24,
  },

  totalCard: {
    flex: 1,
    height: 110,
    borderRadius: 20,
    backgroundColor: WHITE,
    paddingVertical: 16,
    paddingHorizontal: 18,
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

  floatingButtons: {
  position: "absolute",
  top: 415,
  right: 28,
  flexDirection: "row",
  gap: 10,
  zIndex: 10,
},

  floatingAddMoreButton: {
  position: "absolute",
  top: 760,
  right: 28,
  zIndex: 10,
},

floatingAddButton: {
  width: 55,
  height: 55,
  borderRadius: 100,
  backgroundColor: TAB_GREEN,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "transparent",
  shadowOpacity: 0,
  shadowRadius: 0,
  shadowOffset: { width: 0, height: 0 },
},

floatingButton: {
  width: 35,
  height: 35,
  borderRadius: 12,
  backgroundColor: TAB_GREEN,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "transparent",
  shadowOpacity: 0,
  shadowRadius: 0,
  shadowOffset: { width: 0, height: 0 },
},

floatingButtonActive: {
  backgroundColor: DARK_GREEN,
},

  cardContent: {
    paddingHorizontal: 32,
    paddingTop: 30,
    paddingBottom: 120
  },

});

