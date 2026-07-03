import { StyleSheet, View } from "react-native";

import { Skeleton, SkeletonText } from "@/components/ui/loading/Skeleton";

export function TransactionsListSkeleton() {
  return (
    <View style={styles.list}>
      <SkeletonText width={112} height={14} />
      {[0, 1, 2].map((item) => (
        <View key={item} style={styles.row}>
          <Skeleton style={styles.icon} rounded={18} />
          <View style={styles.content}>
            <SkeletonText width="62%" height={14} />
            <SkeletonText width="42%" height={11} />
          </View>
          <SkeletonText width={64} height={14} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
    paddingVertical: 6,
  },

  row: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  icon: {
    width: 54,
    height: 54,
  },

  content: {
    flex: 1,
    gap: 9,
  },
});
