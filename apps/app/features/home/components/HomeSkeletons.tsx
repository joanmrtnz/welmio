import { ScrollView, StyleSheet, View } from "react-native";

import { Skeleton, SkeletonText } from "@/components/ui/loading/Skeleton";

const CARD = "#ffffff";
const BORDER = "rgba(9, 169, 130, 0.12)";

export function HomeGoalsSkeleton({ isDesktop }: { isDesktop: boolean }) {
  if (isDesktop) {
    return (
      <View style={styles.goalsGrid}>
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} style={styles.goalCard} rounded={24} />
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.goalsScroller}
      contentContainerStyle={styles.goalsRow}
    >
      {[0, 1, 2].map((item) => (
        <Skeleton key={item} style={styles.goalCard} rounded={24} />
      ))}
    </ScrollView>
  );
}

export function HomeAnalyticsSkeleton() {
  return (
    <View style={styles.analyticsCard}>
      <View style={styles.analyticsHeader}>
        <View style={styles.analyticsTitleWrap}>
          <SkeletonText width={130} height={16} />
          <SkeletonText width={102} height={12} />
        </View>
        <Skeleton style={styles.analyticsPill} rounded={999} />
      </View>

      <View style={styles.analyticsBars}>
        {[76, 92, 54, 86, 64, 102, 72].map((height, index) => (
          <View key={`${height}-${index}`} style={styles.analyticsBarGroup}>
            <View style={styles.analyticsBarPair}>
              <Skeleton style={[styles.analyticsBar, { height }]} rounded={999} />
              <Skeleton
                style={[styles.analyticsBar, { height: Math.max(height - 30, 34) }]}
                rounded={999}
              />
            </View>
            <SkeletonText width={24} height={9} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function HomeTransactionsSkeleton() {
  return (
    <View style={styles.transactionsList}>
      {[0, 1, 2].map((item) => (
        <View key={item} style={styles.transactionRow}>
          <Skeleton style={styles.transactionIcon} rounded={18} />
          <View style={styles.transactionContent}>
            <SkeletonText width="60%" height={14} />
            <SkeletonText width="42%" height={11} />
          </View>
          <SkeletonText width={58} height={14} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  goalsScroller: {
    marginBottom: 22,
  },

  goalsRow: {
    gap: 12,
    paddingRight: 18,
    paddingBottom: 2,
  },

  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 22,
  },

  goalCard: {
    width: 238,
    height: 116,
  },

  analyticsCard: {
    minHeight: 252,
    backgroundColor: CARD,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 18,
    marginBottom: 22,
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  analyticsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },

  analyticsTitleWrap: {
    gap: 8,
  },

  analyticsPill: {
    width: 76,
    height: 30,
  },

  analyticsBars: {
    height: 152,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    marginTop: 28,
  },

  analyticsBarGroup: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },

  analyticsBarPair: {
    height: 116,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },

  analyticsBar: {
    width: 9,
  },

  transactionsList: {
    gap: 12,
  },

  transactionRow: {
    minHeight: 58,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  transactionIcon: {
    width: 48,
    height: 48,
  },

  transactionContent: {
    flex: 1,
    gap: 8,
  },
});
