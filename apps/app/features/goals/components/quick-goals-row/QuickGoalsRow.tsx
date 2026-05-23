import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { fonts } from "@/theme/fonts";
import type { GoalOverviewItem } from "@repo/shared-types";
import { formatCurrency } from "@/utils/formatCurrency";

const CARD = "#ffffff";
const CARD_SOFT = "#f3fbf8";
const MINT = "#d7f5eb";
const GREEN = "#0bb894";
const GREEN_DARK = "#078a73";
const TEXT = "#063436";
const MUTED = "#6f8790";
const BORDER = "rgba(9, 169, 130, 0.12)";
const DESKTOP_BREAKPOINT = 768;

type QuickGoalsRowProps = {
  goals: GoalOverviewItem[];
  errorMessage?: string | null;
  onGoalPress?: (goal: GoalOverviewItem) => void;
  onEmptyPress?: () => void;
};

function GoalPreviewCard({
  goal,
  onPress,
  isDesktop,
  desktopCardWidth,
}: {
  goal: GoalOverviewItem;
  onPress?: (goal: GoalOverviewItem) => void;
  isDesktop?: boolean;
  desktopCardWidth?: number;
}) {
  const progress = Math.min(Number(goal.progress) || 0, 100);

  return (
    <Pressable
      style={[
        styles.goalCard,
        isDesktop && styles.goalCardDesktop,
        isDesktop && desktopCardWidth ? { width: desktopCardWidth } : null,
      ]}
      onPress={() => onPress?.(goal)}
    >
      <View style={styles.goalIcon}>
        <Icon
          name={(goal.icon ?? "money") as never}
          size={26}
          color={GREEN_DARK}
          strokeWidth={1.2}
        />
      </View>

      <View style={styles.goalContent}>
        <Text style={styles.goalTitle} numberOfLines={1} ellipsizeMode="tail">
          {goal.name}
        </Text>

        <Text style={styles.goalMeta} numberOfLines={1} ellipsizeMode="tail">
          {formatCurrency(goal.saved)} of{" "}
          {formatCurrency(goal.target)}
        </Text>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` as `${number}%` },
              ]}
            />
          </View>
          <Text style={styles.progressPercent}>{progress}%</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function QuickGoalsRow({
  goals,
  errorMessage,
  onGoalPress,
  onEmptyPress,
}: QuickGoalsRowProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const [desktopRowWidth, setDesktopRowWidth] = useState(0);
  const desktopGoals = goals.slice(0, 4);
  const desktopCardWidth = desktopRowWidth > 0 ? (desktopRowWidth - 12) / 2 : undefined;

  if (goals.length === 0) {
    return (
      <Pressable
        style={[styles.emptyCard, isDesktop && styles.emptyCardDesktop]}
        onPress={onEmptyPress}
      >
        <View style={styles.goalIcon}>
          <Icon name="money" size={34} color={GREEN_DARK} strokeWidth={0.9} />
        </View>

        <View style={styles.goalContent}>
          <Text style={styles.goalTitle}>No goals yet</Text>
          <Text style={styles.goalMeta} numberOfLines={2}>
            {errorMessage ??
              "Create your first goal to start tracking progress."}
          </Text>
        </View>
      </Pressable>
    );
  }

  if (isDesktop) {
    return (
      <View
        style={styles.rowDesktop}
        onLayout={(event) => setDesktopRowWidth(event.nativeEvent.layout.width)}
      >
        {desktopGoals.map((goal) => (
          <GoalPreviewCard
            key={goal.id}
            goal={goal}
            onPress={onGoalPress}
            isDesktop
            desktopCardWidth={desktopCardWidth}
          />
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroller}
      contentContainerStyle={styles.row}
    >
      {goals.map((goal) => (
        <GoalPreviewCard key={goal.id} goal={goal} onPress={onGoalPress} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroller: {
    width: "100%",
  },

  row: {
    gap: 12,
    paddingRight: 18,
    paddingBottom: 2,
    marginBottom: 22,
  },

  rowDesktop: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 22,
  },

  goalCard: {
    width: 265,
    minHeight: 96,
    borderRadius: 22,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  goalCardDesktop: {
    width: "48%",
    minWidth: 0,
  },

  emptyCard: {
    minHeight: 82,
    borderRadius: 22,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 22,
  },

  goalIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: MINT,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyCardDesktop: {
    width: "100%",
  },

  goalContent: {
    flex: 1,
    minWidth: 0,
  },

  goalTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  goalMeta: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 15,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },

  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: CARD_SOFT,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: GREEN,
  },

  progressPercent: {
    width: 34,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.bold,
    color: GREEN_DARK,
    textAlign: "right",
  },
});
