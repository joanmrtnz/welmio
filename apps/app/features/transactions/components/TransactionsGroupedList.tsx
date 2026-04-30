import { View, Text, StyleSheet } from "react-native";
import { Icon } from "@/components/icons/Icon";
import { fonts } from "@/theme/fonts";
import { TransactionOverviewGroup } from "@repo/shared-types";
import {
  formatCategoryLabel,
  formatSignedAmount,
  formatTransactionMeta,
} from "../utils/formatters";

const DIVIDER_GREEN = "#00d09e";
const BUTTON_GREEN = "#1A9E6A";
const BLACK = "#052e2b";

type TransactionsGroupedListProps = {
  groups: TransactionOverviewGroup[];
  emptyMessage?: string;
};

export function TransactionsGroupedList({
  groups,
  emptyMessage = "No transactions found.",
}: TransactionsGroupedListProps) {
  if (groups.length === 0) {
    return <Text style={styles.emptyMessage}>{emptyMessage}</Text>;
  }

  return (
    <>
      {groups.map((group) => (
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
    fontSize: 16,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  iconCircle: {
    width: 53,
    height: 53,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: DIVIDER_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 18,
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
});