import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import WelmioAvatar from "@/assets/images/welmio-logo-no-circle.png";

const SCREEN_BG = "#dff7ef";
const CARD = "#ffffff";
const CARD_SOFT = "#f3fbf8";
const MINT = "#d7f5eb";
const MINT_LIGHT = "#eaf9f4";
const GREEN = "#0bb894";
const GREEN_DARK = "#078a73";
const TEXT = "#063436";
const MUTED = "#6f8790";
const DANGER = "#ff4265";
const BORDER = "rgba(9, 169, 130, 0.12)";

const goalCards = [
  { title: "New Car", icon: "car", percent: "35%", progress: "35%" },
  { title: "Emergency Fund", icon: "money", percent: "75%", progress: "75%" },
  { title: "New Laptop", icon: "rent", percent: "20%", progress: "20%" },
];

const analyticsBars = [
  { label: "May 1", income: 66, expense: 44 },
  { label: "May 8", income: 44, expense: 61 },
  { label: "May 15", income: 68, expense: 45 },
  { label: "May 22", income: 66, expense: 39 },
  { label: "May 29", income: 60, expense: 35 },
];

const transactions = [
  {
    title: "Salary Payment",
    meta: "May 30 · 10:30 AM",
    icon: "money",
    amount: "+$4,000.00",
    positive: true,
  },
  {
    title: "Groceries",
    meta: "May 29 · 5:45 PM",
    icon: "food",
    amount: "-$100.00",
    positive: false,
  },
  {
    title: "Rent",
    meta: "May 28 · 9:15 AM",
    icon: "rent",
    amount: "-$674.40",
    positive: false,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.userSide}>
            <View style={styles.avatarFrame}>
              <Image
                source={WelmioAvatar}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>

            <View>
              <Text style={styles.greeting}>Hi, John! 👋</Text>
              <Text style={styles.greetingSub}>Good Morning</Text>
            </View>
          </View>

          <Pressable style={styles.bellButton}>
            <Icon name="bell" size={24} strokeWidth={1.5} color={TEXT} />
          </Pressable>
        </View>

        <SectionHeader title="Overview" />

        <View style={styles.overviewRow}>
          <Pressable style={styles.overviewCard}>
            <View style={styles.overviewIconWrap}>
              <Icon
                name="money"
                size={38}
                color={GREEN_DARK}
                strokeWidth={0.8}
              />
            </View>

            <View>
              <Text style={styles.overviewLabel}>Total Balance</Text>
              <Text style={styles.overviewPositive}>$7,783.00</Text>
            </View>
          </Pressable>

          <Pressable style={styles.overviewCard}>
            <View style={[styles.overviewIconWrap, styles.expenseIconWrap]}>
              <Icon name="expense" size={35} color={DANGER} strokeWidth={0.8} />
            </View>

            <View>
              <Text style={styles.overviewLabel}>Total Expense</Text>
              <Text style={styles.overviewAmount}>-$1,187.40</Text>
            </View>
          </Pressable>
        </View>

        <SectionHeader title="Goals" action="View All" />

        <Pressable style={styles.featureGoalCard}>
          <View style={styles.featureGoalTop}>
            <View style={styles.bigGoalIcon}>
              <Icon
                name="rent"
                size={50}
                color={GREEN_DARK}
                strokeWidth={0.8}
              />
            </View>

            <View style={styles.featureGoalText}>
              <Text style={styles.featureGoalTitle}>Vacation Fund</Text>
              <Text style={styles.featureGoalMeta}>$1,560.00 of $3,000.00</Text>
            </View>
          </View>

          <View style={styles.goalProgressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "52%" }]} />
            </View>
            <Text style={styles.progressPercent}>52%</Text>
          </View>
        </Pressable>

        <View style={styles.goalGrid}>
          {goalCards.map((goal) => (
            <Pressable key={goal.title} style={styles.goalMiniCard}>
              <View style={styles.goalMiniIcon}>
                <Icon
                  name={goal.icon as any}
                  size={35}
                  color={GREEN_DARK}
                  strokeWidth={0.8}
                />
              </View>

              <View style={styles.goalMiniContent}>
                <Text
                  style={styles.goalMiniTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {goal.title}
                </Text>
                <View style={styles.miniProgressRow}>
                  <View style={styles.miniProgressTrack}>
                    <View
                      style={[
                        styles.miniProgressFill,
                        { width: goal.progress },
                      ]}
                    />
                  </View>
                  <Text style={styles.goalMiniPercent}>{goal.percent}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <SectionHeader title="Analytics" action="This Month" />

        <Pressable style={styles.analyticsCard}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotLight]} />
              <Text style={styles.legendText}>Expense</Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            <View style={styles.yAxis}>
              <Text style={styles.axisText}>$3K</Text>
              <Text style={styles.axisText}>$2K</Text>
              <Text style={styles.axisText}>$1K</Text>
              <Text style={styles.axisText}>$0</Text>
            </View>

            <View style={styles.barsArea}>
              {analyticsBars.map((bar) => (
                <View key={bar.label} style={styles.barGroup}>
                  <View style={styles.barColumns}>
                    <View style={[styles.bar, { height: bar.income }]} />
                    <View
                      style={[
                        styles.bar,
                        styles.expenseBar,
                        { height: bar.expense },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{bar.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </Pressable>

        <SectionHeader title="Recent Transactions" action="View All" />

        <View style={styles.transactionsCard}>
          {transactions.map((transaction, index) => (
            <Pressable
              key={transaction.title}
              style={[
                styles.transactionRow,
                index === transactions.length - 1 && styles.transactionRowLast,
              ]}
            >
              <View style={styles.transactionIcon}>
                <Icon
                  name={transaction.icon as any}
                  size={35}
                  color={GREEN_DARK}
                  strokeWidth={0.8}
                />
              </View>

              <View style={styles.transactionTextWrap}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionMeta}>{transaction.meta}</Text>
              </View>

              <Text
                style={[
                  styles.transactionAmount,
                  transaction.positive && styles.transactionAmountPositive,
                ]}
              >
                {transaction.amount}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <LinearGradient
        pointerEvents="none"
        colors={["rgba(223, 247, 239, 0)", SCREEN_BG]}
        style={styles.bottomFade}
      />
    </View>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 128,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  userSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatarFrame: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: MINT,
    borderWidth: 2,
    borderColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: 55,
    height: 55,
  },

  greeting: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  greetingSub: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: TEXT,
  },

  bellButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: CARD,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 7,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  sectionAction: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: GREEN_DARK,
  },

  overviewRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },

  overviewCard: {
    flex: 1,
    minHeight: 78,
    borderRadius: 16,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  overviewIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: MINT_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  expenseIconWrap: {
    backgroundColor: "#fff0f3",
  },

  overviewLabel: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: TEXT,
    marginBottom: 4,
  },

  overviewPositive: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: GREEN_DARK,
  },

  overviewAmount: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  featureGoalCard: {
    borderRadius: 16,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    marginBottom: 12,
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  featureGoalTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  bigGoalIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: MINT_LIGHT,
    borderWidth: 1.2,
    borderColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  featureGoalText: {
    flex: 1,
  },

  featureGoalTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  featureGoalMeta: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  goalProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: MINT,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: GREEN_DARK,
  },

  progressPercent: {
    width: 34,
    textAlign: "right",
    fontSize: 11,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  goalGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },

  goalMiniCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 9,
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "rgba(29, 100, 89, 0.09)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  goalMiniIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: MINT_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  goalMiniContent: {
    flex: 1,
    minWidth: 0,
  },

  goalMiniTitle: {
    fontSize: 9,
    fontFamily: fonts.bold,
    color: TEXT,
    marginBottom: 7,
  },

  miniProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  miniProgressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: MINT,
    overflow: "hidden",
  },

  miniProgressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: GREEN_DARK,
  },

  goalMiniPercent: {
    fontSize: 9,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  analyticsCard: {
    borderRadius: 16,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 10,
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    marginBottom: 12,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN_DARK,
  },

  legendDotLight: {
    backgroundColor: "#cfeedd",
  },

  legendText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: TEXT,
  },

  chartArea: {
    height: 126,
    flexDirection: "row",
  },

  yAxis: {
    width: 34,
    justifyContent: "space-between",
    paddingBottom: 20,
  },

  axisText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: MUTED,
  },

  barsArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  barGroup: {
    alignItems: "center",
    width: 42,
  },

  barColumns: {
    height: 86,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  bar: {
    width: 10,
    borderRadius: 4,
    backgroundColor: GREEN_DARK,
  },

  expenseBar: {
    backgroundColor: "#cbeed7",
  },

  barLabel: {
    marginTop: 7,
    fontSize: 10,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  transactionsCard: {
    borderRadius: 16,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  transactionRow: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(9, 169, 130, 0.08)",
  },

  transactionRowLast: {
    borderBottomWidth: 0,
  },

  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: MINT_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  transactionTextWrap: {
    flex: 1,
  },

  transactionTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: TEXT,
  },

  transactionMeta: {
    marginTop: 4,
    fontSize: 11,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  transactionAmount: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: TEXT,
    marginLeft: 10,
  },

  transactionAmountPositive: {
    color: GREEN_DARK,
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
});
