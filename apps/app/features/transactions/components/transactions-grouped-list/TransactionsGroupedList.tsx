import { View, Text, StyleSheet, Pressable } from "react-native";
import { Icon } from "@/components/icons/Icon";
import { fonts } from "@/theme/fonts";
import type { TransactionOverviewGroup, TransactionOverviewItem } from "@repo/shared-types";
import {
  formatCategoryLabel,
  formatSignedAmount,
  formatTransactionMeta,
} from "../../utils/formatters";
import { TransactionDetailsModal } from "../transaction-details-modal/TransactionDetailsModal";
import { useState } from "react";
import { TransactionDetailsItem } from "../../types/transactionDetails.types";

const DIVIDER_GREEN = "rgba(18, 199, 155, 0.35)";
const BUTTON_GREEN = "#09a982";
const BLACK = "#0b3437";
const ICON_BACKGROUND = "#e2f8f0";
const MUTED = "rgba(11, 52, 55, 0.72)";


type TransactionsGroupedListProps = {
  groups: TransactionOverviewGroup[];
  onChanged?: () => void | Promise<void>;
  onEditTransaction?: (transaction: TransactionOverviewItem) => void;
  onDeleteTransaction?: (transactionId: string) => Promise<void>;
};

export function TransactionsGroupedList({
  groups,
  onChanged,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionsGroupedListProps) {

  const [selectedTransaction, setSelectedTransaction] =
  useState<TransactionDetailsItem | null>(null);

  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  function openTransactionDetails(transaction: TransactionDetailsItem) {
    setSelectedTransaction(transaction);
    setIsDetailsModalVisible(true);
  }

  function closeTransactionDetails() {
    setIsDetailsModalVisible(false);
    setSelectedTransaction(null);
  }

  async function handleDeleteTransaction(transaction: TransactionOverviewItem) {
    try {
      await onDeleteTransaction?.(transaction.id);
      await onChanged?.();
      closeTransactionDetails();
    } catch (error) {
      console.warn("[TransactionsGroupedList] delete transaction error:", error);
    }
  }
  
  function handleEditTransaction(transaction: TransactionOverviewItem) {
    closeTransactionDetails();
    onEditTransaction?.(transaction);
  }

  if (groups.length === 0) {
    return <Text style={styles.emptyMessage}>No transactions found.</Text>;
  }

  return (
    <>
      {groups.map((group) => (
        <View key={group.month}>
          <Text style={styles.monthLabel}>{group.month}</Text>

          {group.items.map((item) => (
            <Pressable key={item.id} 
            style={styles.transactionRow}
            onPress={() => openTransactionDetails(item as TransactionDetailsItem)}>
              <View style={styles.iconCircle}>
                <Icon
                  name={(item.category.icon ?? "money") as never}
                  size={40}
                  strokeWidth={0.6}
                  color={BUTTON_GREEN}
                />
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
            </Pressable>
          ))}
        </View>
      ))}
      <TransactionDetailsModal
        visible={isDetailsModalVisible}
        transaction={selectedTransaction}
        onClose={closeTransactionDetails}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
    </>
  );
}

const styles = StyleSheet.create({
  emptyMessage: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
    textAlign: "center",
    paddingVertical: 24,
  },

  monthLabel: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 2,
    marginBottom: 14,
  },

  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: ICON_BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },

  transactionInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    minWidth: 0,
  },

  transactionTitle: {
    fontSize: 12.5,
    lineHeight: 17,
    fontFamily: fonts.semibold ?? fonts.medium,
    color: BLACK,
  },

  transactionMeta: {
    fontSize: 10.5,
    lineHeight: 15,
    fontFamily: fonts.regular,
    color: MUTED,
    marginTop: 2,
  },

  categoryColumn: {
    height: 32,
    width: 72,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderLeftColor: DIVIDER_GREEN,
    borderLeftWidth: 1,
    borderRightColor: DIVIDER_GREEN,
    borderRightWidth: 1,
    paddingHorizontal: 4,
  },

  amountColumn: {
    width: 78,
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 8,
  },

  transactionCategory: {
    fontSize: 10.5,
    lineHeight: 14,
    fontFamily: fonts.medium,
    color: BLACK,
    textAlign: "center",
  },

  amountPositive: {
    fontSize: 12.5,
    lineHeight: 17,
    fontFamily: fonts.bold,
    color: BLACK,
    textAlign: "right",
  },

  amountNegative: {
    fontSize: 12.5,
    lineHeight: 17,
    fontFamily: fonts.bold,
    color: BLACK,
    textAlign: "right",
  },
});