import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";


const GREEN = "#00c896";
const DIVIDER_GREEN = "#00d09e";
const DARK_GREEN = "#059669";
const LIGHT_GREEN = "#f1fff3";
const MEDIUM_GREEN = "#23C988"
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const BUTTON_GREEN = "#1A9E6A";



export default function HomeScreen() {
  const [selected, setSelected] = useState<"daily" | "weekly" | "monthly">("monthly");

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.headerArea}>
        <Text style={styles.welcome}>Hi, Welcome Back</Text>
        <Text style={styles.subtitle}>Good Morning</Text>
      </View>

      <View style={styles.balanceRow}>
          <View>
            <Text style={styles.label}>Total Balance</Text>
            <Text style={styles.balance}>$7,783.00</Text>
          </View>

          <View style={styles.separator} />

          <View>
            <Text style={styles.label}>Total Expense</Text>
            <Text style={styles.expense}>-$1,187.40</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>
            30% Of Your Expenses, Looks Good.
          </Text>
        </View>

      <View style={styles.card}>               

        <View style={styles.statsCard}>
          <View style={styles.statLeft}>
            <View style={styles.circle}>
              <Icon name="car" size={35} />
            </View>
            <Text style={styles.statTitle}>Savings{"\n"}On Goals</Text>
          </View>

          <View style={styles.separatorVertical} />

          <View style={styles.statRight}>
             <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Icon name="money" size={33} />
              </View>
              
              <View style={styles.statText}>
                <Text style={styles.statLabel}>Revenue Last Week</Text>
                <Text style={styles.statPositive}>$4,000.00</Text>
              </View>
            </View>

            <View style={styles.separatorHorizontal} />

            <View style={styles.statItem}>
               <View style={styles.statIcon}>
                <Icon name="food" size={33} />
               </View>
              
              <View style={styles.statText}>
                <Text style={styles.statLabel}>Food Last Week</Text>
                <Text style={styles.statNegative}>-$100.00</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.filterRow}>
          {["daily", "weekly", "monthly"].map((item) => {
            const isActive = selected === item;

            return (
              <Pressable
                key={item}
                onPress={() => setSelected(item as any)}
                style={[
                  styles.segment,
                  isActive && styles.segmentActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isActive && styles.segmentTextActive,
                  ]}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

       <View style={styles.transactionRow}>
            <View style={styles.iconCircle}>
                <Text style={styles.icon}><Icon name="money" size={25} color={BUTTON_GREEN} /></Text>
            </View>
            <View style={styles.transactionInfo}>
                <Text
                style={styles.transactionTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
                >
                Salary Payment From Main Company
                </Text>
                <Text style={styles.transactionMeta}>18:27 · April 30</Text>
            </View>

            <View style={styles.categoryColumn}>
                <Text style={styles.transactionCategory}>Monthly</Text>
            </View>

            <View style={styles.amountColumn}>
                <Text style={styles.amountPositive}>$4,000.00</Text>
            </View>
        </View>

        <View style={styles.transactionRow}>
            <View style={styles.iconCircle}>
                <Text style={styles.icon}><Icon name="groceries" size={45} color={BUTTON_GREEN} /></Text>
            </View>

            <View style={styles.transactionInfo}>
                <Text
                style={styles.transactionTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
                >
                Groceries
                </Text>
                <Text style={styles.transactionMeta}>17:00 · April 24</Text>
            </View>

            <View style={styles.categoryColumn}>
                <Text style={styles.transactionCategory}>Pantry</Text>
            </View>

            <View style={styles.amountColumn}>
                <Text style={styles.amountPositive}>-$100.00</Text>
            </View>
            
        </View>

          <View style={styles.transactionRow}>
            <View style={styles.iconCircle}>
                <Text style={styles.icon}><Icon name="rent" size={45} color={BUTTON_GREEN}  /></Text>
            </View>

            <View style={styles.transactionInfo}>
                <Text
                style={styles.transactionTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
                >
                Rent
                </Text>
                <Text style={styles.transactionMeta}>8:30 · April 15</Text>
            </View>

            <View style={styles.categoryColumn}>
                <Text style={styles.transactionCategory}>Rent</Text>
            </View>

            <View style={styles.amountColumn}>
                <Text style={styles.amountPositive}>-$674.40</Text>
            </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  headerArea: {
    height: 85,
    justifyContent: "center",
    paddingHorizontal: 38,
    marginTop: 50,
    marginBottom: 20,
  },

  welcome: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: BLACK,
    opacity: 0.8,
  },

  card: {
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    padding: 38,
    height:"100%",
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
    width: "30%",
    height: "100%",
    backgroundColor: BLACK,
  },

  progressText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  statsCard: {
    backgroundColor: GREEN,
    borderRadius: 28,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },

  statLeft: {
    flex: 0.5,
    alignItems: "center",
  },

circle: {
  width: 70,
  height: 70,
  borderRadius: 35,
  borderColor: WHITE,
  borderWidth: 2,
  marginBottom: 8,
  alignItems: "center",
  justifyContent: "center",
},


  statTitle: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
    textAlign: "center",
  },

  separatorVertical: {
    width: 1,
    backgroundColor: "#d1fae5",
    marginHorizontal: 12,
  },

  separatorHorizontal: {
    height: 1,
    backgroundColor: "#d1fae5",
    marginVertical: 12,
  },

  statRight: {
    flex: 1,
  },
  statItem: {
    flexDirection: "row",
    gap: 7,
  },

  statIcon: {
    flex: 0.3,
  },

  statText: {
    flex: 1,
  },

  statLabel: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: BLACK,
  },

  statPositive: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  statNegative: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  filterRow: {
    flexDirection: "row",
    backgroundColor: "#dff7e2",
    borderRadius: 18,
    padding: 5,
    marginBottom: 24,
  },

  segment: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 8,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentActive: {
    backgroundColor: GREEN,
  },

  segmentText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: "#052e2b",
    opacity: 0.6,
  },

  segmentTextActive: {
    opacity: 1,
  },

  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  amountPositive: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  amountNegative: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: BLACK,
  },

iconCircle: {
  width: 53,
  height: 53,
  borderRadius: 17,
  borderWidth: 2,
  borderColor: MEDIUM_GREEN,
  alignItems: "center",
  justifyContent: "center",
},

icon: {
  fontSize: 18,
},



transactionRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 14,
},

transactionInfo: {
  flex: 1,
  marginLeft: 12,
  marginRight: 10,
},

transactionTitle: {
  fontSize: 12,
  fontFamily: fonts.medium,
  color: BLACK,
},

transactionMeta: {
  fontSize: 11,
  fontFamily: fonts.regular,
  color: BLACK,
  marginTop: 5,
},

categoryColumn: {
  height: 32,
  width: 80,
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "center",
  borderLeftColor: DIVIDER_GREEN,
  borderLeftWidth: 1,
  borderRightColor: DIVIDER_GREEN,
  borderRightWidth: 1,
},

amountColumn: {
  width: 90,
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "center",
},

transactionCategory: {
  fontSize: 11,
  fontFamily: fonts.medium,
  color: BLACK,
  textAlign: "center",
},

});

