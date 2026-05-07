import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts } from "@/theme/fonts";
import type {
  TransactionOverviewGroup,
  TransactionOverviewItem,
} from "@repo/shared-types";
import { TransactionDetailsModal } from "../transaction-details-modal/TransactionDetailsModal";
import { TransactionRow } from "../transaction-row/TransactionRow";
import type { TransactionDetailsItem } from "../../types/transactionDetails.types";

const BLACK = "#0b3437";

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

  function openTransactionDetails(transaction: TransactionOverviewItem) {
    setSelectedTransaction(transaction as TransactionDetailsItem);
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
        <View key={group.month} style={styles.groupBlock}>
          <Text style={styles.monthLabel}>{group.month}</Text>

          {group.items.map((item, index) => (
            <TransactionRow
              key={item.id}
              transaction={item}
              onPress={openTransactionDetails}
              showCategory
              withDivider={index < group.items.length - 1}
            />
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

  groupBlock: {
    marginBottom: 8,
  },

  monthLabel: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 2,
    marginBottom: 14,
  },
});
