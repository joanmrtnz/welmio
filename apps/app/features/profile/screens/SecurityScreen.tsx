import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";

export default function SecurityScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrowLeft" size={22} color={BLACK} />
        </Pressable>

        <Text style={styles.title}>Security</Text>

        <Pressable style={styles.notifications}>
          <Icon name="bell" size={22} color={BLACK} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardContent}
        >
          <Text style={styles.sectionTitle}>Security</Text>

          <View style={styles.optionsContainer}>
            <SecurityOption label="Change Pin" />
            <SecurityOption label="Fingerprint" />
            <SecurityOption label="Terms And Conditions" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

type SecurityOptionProps = {
  label: string;
};

function SecurityOption({ label }: SecurityOptionProps) {
  return (
    <Pressable style={styles.optionRow}>
      <Text style={styles.optionLabel}>{label}</Text>
      <Icon name="arrowRight" size={18} color={BLACK} />
    </Pressable>
  );
}

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";
const BLACK = "#052e2b";
const WHITE = "#ffffff";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  headerArea: {
     height: 150,
     flexDirection: "row",
     justifyContent: "space-between",
     alignItems: "center",
     paddingHorizontal: 30,
     paddingTop: 30,
  },
 
  title: {
     fontSize: 18, //18
     color: BLACK,
     fontFamily: fonts.bold,
   },
 
  notifications: {
     backgroundColor: WHITE,
     padding: 3,
     borderRadius: 100,
  },

  card: {
    flex: 1,
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    padding: 24,
  },

  cardContent: {
    paddingTop: 28,
    paddingBottom: 60,
  },

  sectionTitle: {
    fontSize: 16,
    color: BLACK,
    fontFamily: fonts.bold,
    marginBottom: 24,
  },

  optionsContainer: {
    gap: 0,
  },

  optionRow: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(5, 46, 43, 0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionLabel: {
    fontSize: 12,
    color: BLACK,
    fontFamily: fonts.medium,
  },
});