import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from "@/components/icons/Icon";
import { fonts } from "@/theme/fonts";
import { GoalOverviewItem } from "@repo/shared-types";

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";
const CARD_GREEN = "#dff7e2";
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const BUTTON_GREEN = "#1A9E6A";
const DIVIDER_GREEN = "#00d09e";

type GoalDetailsModalProps = {
  visible: boolean;
  goal: GoalOverviewItem | null;
  onClose: () => void;
};

function formatCurrency(amount: number | string, currency = "USD") {
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number.isFinite(numericAmount) ? numericAmount : 0);
}

function formatDate(date?: string | null) {
  if (!date) return "No deadline";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function GoalDetailsModal({
  visible,
  goal,
  onClose,
}: GoalDetailsModalProps) {
  if (!goal) return null;

  const remainingAmount = Math.max(goal.target - goal.saved, 0);
  const progress = Math.min(goal.progress, 100);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modal}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Goal Details</Text>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Icon name="plus" size={24} color={BLACK} strokeWidth={1.6} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.heroCard}>
              <View style={styles.heroTop}>
                <View style={styles.heroIcon}>
                  <Icon
                    name={(goal.icon ?? "home") as never}
                    size={44}
                    color={WHITE}
                    strokeWidth={1.1}
                  />
                </View>

                <View style={styles.heroInfo}>
                  <Text style={styles.heroLabel}>{goal.statusLabel}</Text>
                  <Text style={styles.heroTitle}>{goal.name}</Text>
                  <Text style={styles.heroMeta}>
                    {goal.type.replace("_", " ")} · {formatDate(goal.targetDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.progressCircle}>
                <Text style={styles.progressValue}>{progress}%</Text>
                <Text style={styles.progressLabel}>completed</Text>
              </View>

              <View style={styles.mainProgressBar}>
                <View
                  style={[
                    styles.mainProgressFill,
                    {
                      width: `${progress}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.amountsCard}>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Saved</Text>
                <Text style={styles.amountValue}>
                  {formatCurrency(goal.saved, goal.currency)}
                </Text>
              </View>

              <View style={styles.amountSeparator} />

              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Target</Text>
                <Text style={styles.amountValue}>
                  {formatCurrency(goal.target, goal.currency)}
                </Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Icon name="money" size={24} color={BLACK} strokeWidth={1.2} />
                </View>

                <Text style={styles.statLabel}>Remaining</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(remainingAmount, goal.currency)}
                </Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Icon
                    name="calendar"
                    size={24}
                    color={BLACK}
                    strokeWidth={1.2}
                  />
                </View>

                <Text style={styles.statLabel}>Monthly needed</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(goal.monthlyNeeded, goal.currency)}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Progress insight</Text>

              <Text style={styles.infoText}>
                You have saved {formatCurrency(goal.saved, goal.currency)} of{" "}
                {formatCurrency(goal.target, goal.currency)}. To reach this goal
                on time, you need around{" "}
                {formatCurrency(goal.monthlyNeeded, goal.currency)} per month.
              </Text>
            </View>

            <View style={styles.mockHistoryCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent contributions</Text>
                <Text style={styles.mockLabel}>Mock</Text>
              </View>

              <View style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Icon name="income" size={22} color={WHITE} strokeWidth={1.3} />
                </View>

                <View style={styles.historyContent}>
                  <Text style={styles.historyTitle}>Initial amount</Text>
                  <Text style={styles.historyDate}>May 01, 2026</Text>
                </View>

                <Text style={styles.historyAmount}>
                  +{formatCurrency(goal.saved, goal.currency)}
                </Text>
              </View>

              <View style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <Icon name="income" size={22} color={WHITE} strokeWidth={1.3} />
                </View>

                <View style={styles.historyContent}>
                  <Text style={styles.historyTitle}>Monthly saving</Text>
                  <Text style={styles.historyDate}>Jun 01, 2026</Text>
                </View>

                <Text style={styles.historyAmount}>
                  +{formatCurrency(goal.monthlyNeeded, goal.currency)}
                </Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Edit goal</Text>
              </Pressable>

              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Add contribution</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.32)",
  },

  modal: {
    maxHeight: "90%",
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    paddingTop: 12,
    overflow: "hidden",
  },

  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: DIVIDER_GREEN,
    alignSelf: "center",
    marginBottom: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "45deg" }],
  },

  content: {
    paddingHorizontal: 28,
    paddingBottom: 34,
  },

  heroCard: {
    backgroundColor: GREEN,
    borderRadius: 30,
    padding: 20,
    marginBottom: 18,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  heroInfo: {
    flex: 1,
  },

  heroLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
    opacity: 0.75,
  },

  heroTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 4,
  },

  heroMeta: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
    marginTop: 5,
    textTransform: "capitalize",
  },

  progressCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 5,
    borderColor: WHITE,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  progressValue: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: WHITE,
  },

  progressLabel: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: WHITE,
    marginTop: 2,
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

  amountsCard: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderRadius: 24,
    paddingVertical: 18,
    marginBottom: 16,
  },

  amountItem: {
    flex: 1,
    alignItems: "center",
  },

  amountSeparator: {
    width: 1,
    backgroundColor: CARD_GREEN,
  },

  amountLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
    opacity: 0.7,
  },

  amountValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 5,
  },

  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: CARD_GREEN,
    borderRadius: 22,
    padding: 14,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  statLabel: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: BLACK,
    opacity: 0.75,
  },

  statValue: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 5,
  },

  infoCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  infoText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
    lineHeight: 19,
    marginTop: 8,
  },

  mockHistoryCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  mockLabel: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: BLACK,
    backgroundColor: CARD_GREEN,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  historyContent: {
    flex: 1,
  },

  historyTitle: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  historyDate: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: BLACK,
    opacity: 0.65,
    marginTop: 3,
  },

  historyAmount: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: BUTTON_GREEN,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },

  secondaryButton: {
    flex: 1,
    height: 54,
    borderRadius: 20,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  primaryButton: {
    flex: 1.2,
    height: 54,
    borderRadius: 20,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
  },
});