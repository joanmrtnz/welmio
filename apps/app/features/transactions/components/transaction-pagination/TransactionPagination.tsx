import { Pressable, StyleSheet, Text, View } from "react-native";
import type { BrowseTransactionsResponse } from "@repo/shared-types";
import { t } from "@/lib/i18n";

type Props = {
  pagination: BrowseTransactionsResponse["pagination"];
  loading: boolean;
  onPageChange: (page: number) => void;
};

export function TransactionPagination({
  pagination,
  loading,
  onPageChange,
}: Props) {
  const { page, pageSize, total, totalPages } = pagination;
  return (
    <View style={styles.container}>
      <Text accessibilityLiveRegion="polite" style={styles.text}>
        {t("transactions.browse.resultCount", {
          from: total ? (page - 1) * pageSize + 1 : 0,
          to: Math.min(page * pageSize, total),
          total,
        })}
      </Text>
      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: loading || page <= 1 }}
          disabled={loading || page <= 1}
          style={[styles.button, (loading || page <= 1) && styles.disabled]}
          onPress={() => onPageChange(page - 1)}
        >
          <Text style={styles.text}>{t("transactions.browse.previous")}</Text>
        </Pressable>
        <Text
          accessibilityLabel={t("transactions.browse.pageStatus", {
            page,
            totalPages,
          })}
          style={styles.text}
        >
          {page} / {totalPages}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: loading || page >= totalPages }}
          disabled={loading || page >= totalPages}
          style={[
            styles.button,
            (loading || page >= totalPages) && styles.disabled,
          ]}
          onPress={() => onPageChange(page + 1)}
        >
          <Text style={styles.text}>{t("transactions.browse.next")}</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { gap: 12, paddingVertical: 16, alignItems: "center" },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    flexWrap: "wrap",
  },
  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#a9efdf",
    borderRadius: 10,
  },
  text: { color: "#063b3a", fontSize: 13 },
  disabled: { opacity: 0.4 },
});
