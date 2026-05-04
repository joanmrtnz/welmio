import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { router } from "expo-router";

const GREEN = "#00c896";
const DIVIDER_GREEN = "#00d09e";
const DARK_GREEN = "#059669";
const LIGHT_GREEN = "#f1fff3";
const CARD_GREEN = "#dff7e2";
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const TAB_GREEN = "#14cfa1";
const BUTTON_GREEN = "#1A9E6A";

const goals = [
  {
    id: "1",
    name: "House Deposit",
    icon: "rent",
    saved: 9000,
    target: 30000,
    targetDate: "Dec 2027",
    monthlyNeeded: 875,
    status: "A bit behind",
    progress: 30,
  },
  {
    id: "2",
    name: "Emergency Fund",
    icon: "money",
    saved: 3250,
    target: 5000,
    targetDate: "Oct 2026",
    monthlyNeeded: 290,
    status: "On track",
    progress: 65,
  },
  {
    id: "3",
    name: "New Laptop",
    icon: "income",
    saved: 720,
    target: 1200,
    targetDate: "Aug 2026",
    monthlyNeeded: 160,
    status: "On track",
    progress: 60,
  },
];

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export default function GoalsScreen() {
  const totalSaved = goals.reduce((total, goal) => total + goal.saved, 0);
  const totalTarget = goals.reduce((total, goal) => total + goal.target, 0);
  const totalMonthlyNeeded = goals.reduce(
    (total, goal) => total + goal.monthlyNeeded,
    0,
  );

  const globalProgress = Math.round((totalSaved / totalTarget) * 100);
  const mainGoal = goals[0];

  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrowLeft" size={22} strokeWidth={2.5} color={BLACK} />
        </Pressable>

        <Text style={styles.title}>Goals</Text>

        <View style={styles.notifications}>
          <Icon name="bell" size={28} strokeWidth={1.5} color={BLACK} />
        </View>
      </View>

      <View style={styles.balanceRow}>
        <View>
          <Text style={styles.label}>Total Saved</Text>
          <Text style={styles.balance}>{formatCurrency(totalSaved)}</Text>
        </View>

        <View style={styles.separator} />

        <View>
          <Text style={styles.label}>Target Amount</Text>
          <Text style={styles.expense}>{formatCurrency(totalTarget)}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${globalProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {globalProgress}% of your goals completed.
        </Text>
      </View>

      <View style={styles.cardWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardContent}
        >
          <View style={styles.mainGoalCard}>
            <View style={styles.mainGoalHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>Main Goal</Text>
                <Text style={styles.mainGoalTitle}>{mainGoal.name}</Text>
              </View>

              <View style={styles.mainGoalIcon}>
                <Icon name="car" size={55} color={WHITE} strokeWidth={0.8} />
              </View>
            </View>

            <View style={styles.bigProgressRow}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressCircleValue}>
                  {mainGoal.progress}%
                </Text>
              </View>

              <View style={styles.mainGoalInfo}>
                <Text style={styles.goalAmount}>
                  {formatCurrency(mainGoal.saved)}
                </Text>
                <Text style={styles.goalMeta}>
                  saved of {formatCurrency(mainGoal.target)}
                </Text>
                <Text style={styles.goalMeta}>
                  Target date · {mainGoal.targetDate}
                </Text>
              </View>
            </View>

            <View style={styles.mainProgressBar}>
              <View
                style={[
                  styles.mainProgressFill,
                  { width: `${mainGoal.progress}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.paceCard}>
            <View style={styles.paceItem}>
              <View style={styles.smallIconBox}>
                <Icon name="calendar" size={24} color={BLACK} />
              </View>
              <Text style={styles.paceLabel}>Monthly Needed</Text>
              <Text style={styles.paceValue}>
                {formatCurrency(totalMonthlyNeeded)}
              </Text>
            </View>

            <View style={styles.paceSeparator} />

            <View style={styles.paceItem}>
              <View style={styles.smallIconBox}>
                <Icon name="income" size={24} color={BLACK} />
              </View>
              <Text style={styles.paceLabel}>Active Goals</Text>
              <Text style={styles.paceValue}>{goals.length}</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Goals</Text>

            <Pressable style={styles.filterButton}>
              <Text style={styles.filterText}>Active</Text>
            </Pressable>
          </View>

          {goals.map((goal) => (
            <Pressable key={goal.id} style={styles.goalCard}>
              <View style={styles.goalTopRow}>
                <View style={styles.goalLeft}>
                  <View style={styles.iconCircle}>
                    <Icon
                      name={goal.icon as never}
                      size={30}
                      color={BUTTON_GREEN}
                      strokeWidth={1.2}
                    />
                  </View>

                  <View style={styles.goalTextContent}>
                    <Text
                      style={styles.goalTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {goal.name}
                    </Text>
                    <Text style={styles.goalSubtitle}>
                      {goal.targetDate} · {goal.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.percentBadge}>
                  <Text style={styles.percentText}>{goal.progress}%</Text>
                </View>
              </View>

              <View style={styles.goalProgressBar}>
                <View
                  style={[
                    styles.goalProgressFill,
                    { width: `${goal.progress}%` },
                  ]}
                />
              </View>

              <View style={styles.goalBottomRow}>
                <Text style={styles.goalSmallText}>
                  {formatCurrency(goal.saved)} saved
                </Text>
                <Text style={styles.goalSmallText}>
                  {formatCurrency(goal.target)}
                </Text>
              </View>
            </Pressable>
          ))}

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Icon name="money" size={28} color={WHITE} strokeWidth={1.2} />
            </View>

            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Smart tip</Text>
              <Text style={styles.tipText}>
                You need around {formatCurrency(mainGoal.monthlyNeeded)} per
                month to reach your house deposit goal on time.
              </Text>
            </View>
          </View>
        </ScrollView>

        <Pressable style={styles.fab}>
          <Icon name="plus" size={28} color={BLACK} strokeWidth={1.6} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  headerArea: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 50,
    marginBottom: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  notifications: {
    backgroundColor: WHITE,
    padding: 3,
    borderRadius: 100,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    gap: 30,
  },

  label: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
  },

  balance: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: WHITE,
  },

  expense: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  separator: {
    width: 1,
    backgroundColor: "#d1fae5",
  },

  progressContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  progressBar: {
    height: 20,
    borderRadius: 10,
    width: "70%",
    backgroundColor: "#d1fae5",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: BLACK,
  },

  progressText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  cardWrapper: {
    flex: 1,
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    paddingTop: 38,
    overflow: "hidden",
  },

  cardContent: {
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 120,
  },

  mainGoalCard: {
    backgroundColor: GREEN,
    borderRadius: 28,
    padding: 20,
    marginBottom: 24,
  },

  mainGoalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  sectionEyebrow: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
    opacity: 0.75,
  },

  mainGoalTitle: {
    fontSize: 19,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 4,
  },

  mainGoalIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  bigProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  progressCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },

  progressCircleValue: {
    fontSize: 21,
    fontFamily: fonts.bold,
    color: WHITE,
  },

  mainGoalInfo: {
    flex: 1,
  },

  goalAmount: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  goalMeta: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
    opacity: 0.8,
    marginTop: 4,
  },

  mainProgressBar: {
    height: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.45)",
    overflow: "hidden",
  },

  mainProgressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: BLACK,
  },

  paceCard: {
    flexDirection: "row",
    backgroundColor: CARD_GREEN,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  paceItem: {
    flex: 1,
    alignItems: "center",
  },

  smallIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: TAB_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  paceLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
  },

  paceValue: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 4,
  },

  paceSeparator: {
    width: 1,
    backgroundColor: DIVIDER_GREEN,
    marginHorizontal: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  filterButton: {
    backgroundColor: GREEN,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },

  filterText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  goalCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
  },

  goalTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  goalLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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

  goalTextContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  goalTitle: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  goalSubtitle: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: BLACK,
    opacity: 0.75,
    marginTop: 5,
  },

  percentBadge: {
    minWidth: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: CARD_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  percentText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  goalProgressBar: {
    height: 8,
    borderRadius: 8,
    backgroundColor: CARD_GREEN,
    overflow: "hidden",
    marginTop: 14,
  },

  goalProgressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: GREEN,
  },

  goalBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  goalSmallText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: BLACK,
    opacity: 0.75,
  },

  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_GREEN,
    borderRadius: 24,
    padding: 16,
    marginTop: 10,
  },

  tipIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
    marginBottom: 4,
  },

  tipText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
    lineHeight: 18,
  },

  fab: {
    position: "absolute",
    right: 28,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
});