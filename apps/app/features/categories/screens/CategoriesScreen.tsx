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


export default function CategoriesScreen() {
  return (
    <ScrollView style={styles.screen}>
        <View style={styles.headerArea}>
            <Icon name="back" size={18} color={WHITE} />
            <Text style={styles.title}>Categories</Text>
            <View style={styles.notifications}>
                <Icon name="bell"/>
            </View>
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
        <View style={styles.grid}>
          {[
            { label: "Food", icon: "food", size: 45},
            { label: "Transport", icon: "car", size: 45},
            { label: "Medicine", icon: "medicine", size: 65 },
            { label: "Groceries", icon: "groceries", size: 65 },
            { label: "Rent", icon: "rent", size: 65 },
            { label: "Gifts", icon: "gift", size: 70 },
            { label: "Savings", icon: "savings", size: 70 },
            { label: "Entertainment", icon: "ticket", size: 70 },
            { label: "More", icon: "plus", size: 65 },
          ].map((item) => (
            <View key={item.label} style={styles.gridItem}>
              <View style={styles.gridIcon}>
                <Icon name={item.icon as any} size={item.size} color={WHITE} />
              </View>
              <Text style={styles.gridLabel}>{item.label}</Text>
            </View>
          ))}
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

grid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

gridItem: {
  width: "30%",
  alignItems: "center",
  marginBottom: 48,
},

gridIcon: {
  width: 95,
  height: 95,
  borderRadius: 22,
  backgroundColor: BUTTON_GREEN,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,
},

gridLabel: {
  fontSize: 12,
  fontFamily: fonts.medium,
  color: "#052e2b",
  textAlign: "center",
},



});

