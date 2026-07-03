import { StyleSheet, View } from "react-native";

import { Skeleton, SkeletonText } from "@/components/ui/loading/Skeleton";

export function AnalyticsChartSkeleton() {
  return (
    <View style={styles.chartArea}>
      <View style={styles.axis}>
        <SkeletonText width={38} height={10} />
        <SkeletonText width={34} height={10} />
        <SkeletonText width={24} height={10} />
      </View>
      <View style={styles.barsRow}>
        {[72, 104, 58, 92, 82, 110].map((height, index) => (
          <View key={`${height}-${index}`} style={styles.barGroup}>
            <View style={styles.barPair}>
              <Skeleton style={[styles.bar, { height }]} rounded={999} />
              <Skeleton
                style={[styles.bar, { height: Math.max(height - 28, 36) }]}
                rounded={999}
              />
            </View>
            <SkeletonText width={28} height={10} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function AnalyticsListSkeleton() {
  return (
    <View style={styles.list}>
      {[0, 1, 2].map((item) => (
        <View key={item} style={styles.listItem}>
          <SkeletonText width="46%" height={14} />
          <SkeletonText width={78} height={14} />
          <Skeleton style={styles.horizontalBar} rounded={999} />
          <SkeletonText width="58%" height={11} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chartArea: {
    minHeight: 172,
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },

  axis: {
    width: 42,
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  barsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
  },

  barGroup: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },

  barPair: {
    height: 132,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
  },

  bar: {
    width: 10,
  },

  list: {
    gap: 18,
    paddingTop: 6,
  },

  listItem: {
    gap: 9,
  },

  horizontalBar: {
    width: "100%",
    height: 9,
  },
});
