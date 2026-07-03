import { StyleSheet, View } from "react-native";

import { Skeleton, SkeletonText } from "@/components/ui/loading/Skeleton";

export function GoalsScreenSkeleton({ isDesktop }: { isDesktop: boolean }) {
  return (
    <View style={styles.shell}>
      <View style={[styles.balanceRow, isDesktop && styles.balanceRowDesktop]}>
        <View style={styles.balanceColumn}>
          <SkeletonText width={92} height={13} />
          <SkeletonText width={116} height={24} style={styles.textGap} />
        </View>
        <View style={styles.separator} />
        <View style={styles.balanceColumn}>
          <SkeletonText width={96} height={13} />
          <SkeletonText width={116} height={24} style={styles.textGap} />
        </View>
      </View>

      <Skeleton
        style={[styles.mainGoalCard, isDesktop && styles.mainGoalCardDesktop]}
        rounded={28}
      />

      <View style={[styles.paceCard, isDesktop && styles.paceCardDesktop]}>
        <View style={styles.paceItem}>
          <Skeleton style={styles.smallIcon} rounded={14} />
          <SkeletonText width={92} height={12} />
          <SkeletonText width={78} height={17} />
        </View>
        <View style={styles.paceSeparator} />
        <View style={styles.paceItem}>
          <Skeleton style={styles.smallIcon} rounded={14} />
          <SkeletonText width={86} height={12} />
          <SkeletonText width={42} height={17} />
        </View>
      </View>

      <View style={[styles.goalsList, isDesktop && styles.goalsGrid]}>
        {[0, 1, 2].map((item) => (
          <Skeleton
            key={item}
            style={[styles.goalCard, isDesktop && styles.goalCardDesktop]}
            rounded={22}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    gap: 18,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    gap: 30,
  },

  balanceRowDesktop: {
    gap: 56,
    marginBottom: 28,
  },

  balanceColumn: {
    minWidth: 104,
    alignItems: "center",
  },

  textGap: {
    marginTop: 8,
  },

  separator: {
    width: 1,
    height: 44,
    backgroundColor: "#7adcc8",
  },

  mainGoalCard: {
    minHeight: 224,
    marginBottom: 18,
  },

  mainGoalCardDesktop: {
    minHeight: 248,
  },

  paceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 24,
    backgroundColor: "#f8fffc",
    padding: 16,
    marginBottom: 24,
  },

  paceCardDesktop: {
    paddingHorizontal: 22,
  },

  paceItem: {
    flex: 1,
    alignItems: "center",
  },

  paceSeparator: {
    width: 1,
    height: 58,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },

  smallIcon: {
    width: 42,
    height: 42,
    marginBottom: 7,
  },

  goalsList: {
    gap: 14,
    marginBottom: 20,
  },

  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  goalCard: {
    minHeight: 132,
  },

  goalCardDesktop: {
    width: "48%",
    flexGrow: 1,
  },
});
