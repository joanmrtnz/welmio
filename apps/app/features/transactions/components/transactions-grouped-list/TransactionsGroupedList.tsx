import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import i18n, { t } from "@/lib/i18n";
import { fonts } from "@/theme/fonts";
import type {
  TransactionOverviewGroup,
  TransactionOverviewItem,
} from "@repo/shared-types";
import { TransactionDetailsModal } from "../transaction-details-modal/TransactionDetailsModal";
import { TransactionRow } from "../transaction-row/TransactionRow";
import type { TransactionDetailsItem } from "../../types/transactionDetails.types";

const BLACK = "#0b3437";

const MONTH_KEY_BY_ENGLISH_NAME: Record<string, string> = {
  january: "january",
  february: "february",
  march: "march",
  april: "april",
  may: "may",
  june: "june",
  july: "july",
  august: "august",
  september: "september",
  october: "october",
  november: "november",
  december: "december",
};

type TransactionsGroupedListProps = {
  groups: TransactionOverviewGroup[];
  onChanged?: () => void | Promise<void>;
  onEditTransaction?: (transaction: TransactionOverviewItem) => void;
  onDeleteTransaction?: (transactionId: string) => Promise<void>;
  isDesktop?: boolean;
};

export function TransactionsGroupedList({
  groups,
  onChanged,
  onEditTransaction,
  onDeleteTransaction,
  isDesktop = false,
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
    return (
      <Text
        style={[styles.emptyMessage, isDesktop && styles.emptyMessageDesktop]}
      >
        {t("transactions.groupedList.emptyMessage")}
      </Text>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <View
          key={group.month}
          style={[styles.groupBlock, isDesktop && styles.groupBlockDesktop]}
        >
          <Text
            style={[styles.monthLabel, isDesktop && styles.monthLabelDesktop]}
          >
            {formatGroupMonthLabel(group.month)}
          </Text>

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

function formatGroupMonthLabel(monthLabel: string) {
  const trimmedMonthLabel = monthLabel.trim();

  const isoMonthDate = getDateFromIsoMonthLabel(trimmedMonthLabel);

  if (isoMonthDate) {
    return new Intl.DateTimeFormat(i18n.locale || "en", {
      month: "long",
      year: "numeric",
    }).format(isoMonthDate);
  }

  const englishMonthMatch = trimmedMonthLabel.match(
    /^([a-zA-Z]+)(?:\s+(\d{4}))?$/,
  );

  if (!englishMonthMatch) {
    return monthLabel;
  }

  const [, monthName, year] = englishMonthMatch;
  const monthKey = MONTH_KEY_BY_ENGLISH_NAME[monthName.toLowerCase()];

  if (!monthKey) {
    return monthLabel;
  }

  const translatedMonth = t(`transactions.groupedList.months.${monthKey}`);

  return year ? `${translatedMonth} ${year}` : translatedMonth;
}

function getDateFromIsoMonthLabel(monthLabel: string) {
  const isoMonthMatch = monthLabel.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);

  if (!isoMonthMatch) {
    return null;
  }

  const [, year, month] = isoMonthMatch;

  return new Date(Number(year), Number(month) - 1, 1);
}

const styles = StyleSheet.create({
  emptyMessage: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
    textAlign: "center",
    paddingVertical: 24,
  },

  emptyMessageDesktop: {
    paddingVertical: 34,
  },

  groupBlock: {
    marginBottom: 8,
  },

  groupBlockDesktop: {
    marginBottom: 16,
  },

  monthLabel: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 2,
    marginBottom: 14,
  },

  monthLabelDesktop: {
    marginTop: 4,
    marginBottom: 16,
  },
});