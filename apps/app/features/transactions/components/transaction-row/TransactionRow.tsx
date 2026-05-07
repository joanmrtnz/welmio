import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Icon } from "@/components/icons/Icon";
import { fonts } from "@/theme/fonts";
import type { TransactionOverviewItem } from "@repo/shared-types";
import {
  formatCategoryLabel,
  formatSignedAmount,
  formatTransactionMeta,
} from "@/features/transactions/utils/formatters";

const GREEN = "#09a982";
const BLACK = "#0b3437";
const ICON_BACKGROUND = "#e2f8f0";
const MUTED = "rgba(11, 52, 55, 0.72)";
const DIVIDER = "rgba(18, 199, 155, 0.35)";
const ROW_DIVIDER = "rgba(9, 169, 130, 0.08)";

type TransactionRowProps = {
  transaction: TransactionOverviewItem;
  onPress?: (transaction: TransactionOverviewItem) => void;
  compact?: boolean;
  showCategory?: boolean;
  withDivider?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function TransactionRow({
  transaction,
  onPress,
  compact = false,
  showCategory = true,
  withDivider = false,
  style,
}: TransactionRowProps) {
  const isExpense = transaction.type === "expense";

  return (
    <Pressable
      disabled={!onPress}
      onPress={() => onPress?.(transaction)}
      style={[
        styles.row,
        compact && styles.rowCompact,
        withDivider && styles.rowWithDivider,
        style,
      ]}
    >
      <View style={[styles.iconCircle, compact && styles.iconCircleCompact]}>
        <Icon
          name={(transaction.category.icon ?? "money") as never}
          size={compact ? 34 : 40}
          strokeWidth={0.6}
          color={GREEN}
        />
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.title, compact && styles.titleCompact]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {transaction.description}
        </Text>

        <Text
          style={[styles.meta, compact && styles.metaCompact]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {formatTransactionMeta(transaction.date)}
        </Text>
      </View>

      {showCategory ? (
        <View style={styles.categoryColumn}>
          <Text
            style={styles.category}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {formatCategoryLabel(
              transaction.category.name,
              transaction.frequencyType,
              transaction.transactionNature,
            )}
          </Text>
        </View>
      ) : null}

      <View style={[styles.amountColumn, compact && styles.amountColumnCompact]}>
        <Text
          style={[
            styles.amount,
            isExpense ? styles.amountNegative : styles.amountPositive,
            compact && styles.amountCompact,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {formatSignedAmount(
            transaction.amount,
            transaction.type,
            transaction.currency,
          )}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  rowCompact: {
    minHeight: 66,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  rowWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: ROW_DIVIDER,
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

  iconCircleCompact: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },

  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    minWidth: 0,
  },

  title: {
    fontSize: 12.5,
    lineHeight: 17,
    fontFamily: fonts.semibold ?? fonts.medium,
    color: BLACK,
  },

  titleCompact: {
    fontSize: 13,
    lineHeight: 17,
    fontFamily: fonts.bold,
  },

  meta: {
    fontSize: 10.5,
    lineHeight: 15,
    fontFamily: fonts.regular,
    color: MUTED,
    marginTop: 2,
  },

  metaCompact: {
    fontSize: 11,
    lineHeight: 15,
    fontFamily: fonts.medium,
    marginTop: 4,
  },

  categoryColumn: {
    height: 32,
    width: 72,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderLeftColor: DIVIDER,
    borderLeftWidth: 1,
    borderRightColor: DIVIDER,
    borderRightWidth: 1,
    paddingHorizontal: 4,
  },

  category: {
    fontSize: 10.5,
    lineHeight: 14,
    fontFamily: fonts.medium,
    color: BLACK,
    textAlign: "center",
  },

  amountColumn: {
    width: 78,
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 8,
  },

  amountColumnCompact: {
    width: 88,
  },

  amount: {
    fontSize: 12.5,
    lineHeight: 17,
    fontFamily: fonts.bold,
    textAlign: "right",
  },

  amountCompact: {
    fontSize: 13,
    lineHeight: 17,
  },

  amountPositive: {
    color: GREEN,
  },

  amountNegative: {
    color: BLACK,
  },
});
