import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";


const GREEN = "#00c896";
const DIVIDER_GREEN = "#00d09e";
const DARK_GREEN = "#059669";
const LIGHT_GREEN = "#f1fff3";
const MEDIUM_GREEN = "#dff7e2"
const WHITE = "#ffffff";
const BLACK = "#052e2b";


export default function AnalyticsScreen() {

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.headerArea}>
        <Icon name="back" size={18} color={WHITE} />
        <Text style={styles.title}>Quickly Analysis</Text>
        <View style={styles.notifications}>
          <Icon name="bell"/>
        </View>
      </View>

      <View style={styles.statsCard}>
          <View style={styles.statLeft}>
            <View style={styles.circle}>
              <Icon name="car" size={40}/>
            </View>
            <Text style={styles.statTitle}>Savings{"\n"}On Goals</Text>
          </View>

          <View style={styles.separatorVertical} />

          <View style={styles.statRight}>
             <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Icon name="money" size={33}  />
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


      <View style={styles.card}>               

      <View style={styles.graphicCard}>
        <View style={styles.graphHeader}>
          <Text style={styles.graphTitle}>April Expenses</Text>

          <View style={styles.graphActions}>
            <Pressable style={styles.graphIcon}>
              <Icon name="search" />
            </Pressable>

            <Pressable style={styles.graphIcon}>
              <Icon name="calendar" />
            </Pressable>
          </View>
        </View>

        <View>
        {/*  TODO: create real graphic*/}
        </View>
      </View>

       <View style={styles.transactionRow}>
            <View style={styles.iconCircle}>
                <Text style={styles.icon}><Icon name="money" size={25} /></Text>
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
                <Text style={styles.icon}><Icon name="groceries" size={45}/></Text>
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
                <Text style={styles.icon}><Icon name="rent" size={45} /></Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 38,
    paddingVertical: 10,
    marginTop: 30,

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

 graphicCard: {
  backgroundColor: MEDIUM_GREEN,
  borderRadius: 24,
  padding: 20,
  },

  graphHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  graphTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  graphActions: {
    flexDirection: "row",
    gap: 12,
  },

  graphIcon: {
    backgroundColor: GREEN,
    padding: 3,
    borderRadius: 7,
  },

  statsCard: {
    backgroundColor: GREEN,
    borderRadius: 28,
    padding: 16,
    marginHorizontal: 30,
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
    borderColor: DIVIDER_GREEN,
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

