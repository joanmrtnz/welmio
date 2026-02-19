import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
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


export default function TransactionScreen() {
  return (
    <ScrollView style={styles.screen}>
        <View style={styles.headerArea}>
            <Icon name="back" size={18} color={WHITE} />
            <Text style={styles.title}>Transactions</Text>
            <View style={styles.notifications}>
                <Icon name="bell"/>
            </View>
        </View>

        <View style={styles.balanceCard}>
            <Text style={styles.balanceCardLabel}>Total Balance</Text>
            <Text style={styles.balanceCardTitle}>$7,783.00</Text>
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
       <Text style={styles.monthLabel}>April</Text>
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
                <Text style={styles.icon}><Icon name="groceries" size={45}  color={BUTTON_GREEN} /></Text>
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
                <Text style={styles.icon}><Icon name="rent" size={45}  color={BUTTON_GREEN}  /></Text>
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

        <View style={styles.transactionRow}>
            <View style={styles.iconCircle}>
                <Text style={styles.icon}><Icon name="money" size={25}  color={BUTTON_GREEN} /></Text>
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

        <Text style={styles.monthLabel}>March</Text>

        <View style={styles.transactionRow}>
            <View style={styles.iconCircle}>
                <Text style={styles.icon}><Icon name="groceries" size={45}  color={BUTTON_GREEN} /></Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 38,
    paddingVertical: 10,
    marginTop: 50,
    marginBottom: 20,
  },

  title: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  notifications: {
    backgroundColor: WHITE,
    padding: 3,
    borderRadius: 100,
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

  balanceCard: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 10,
    padding: 16,
    gap: 5,
    textAlign: "center",
    justifyContent: "center",
    marginVertical: 20,
    marginHorizontal: 30,
  },

  balanceCardLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "center",
    color: BLACK,
  },

  balanceCardTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    textAlign: "center",
    color: BLACK,
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

monthLabel: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: BLACK,
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

