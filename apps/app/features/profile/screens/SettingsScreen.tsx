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

export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.headerArea}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrowLeft" size={22} color={BLACK} />
        </Pressable>

        <Text style={styles.title}>Settings</Text>

        <Pressable style={styles.notifications}>
          <Icon name="bell" size={22} color={BLACK} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardContent}
        >
          <View style={styles.optionsContainer}>
            <SettingsOption
              icon="key"
              label="Change Password"
              onPress={() => router.push("/profile/change-password")}
            />
            <SettingsOption icon="user" label="Delete Account" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

type SettingsOptionProps = {
  icon: any;
  label: string;
  onPress?: () => void;
};

function SettingsOption({ icon, label, onPress }: SettingsOptionProps) {
  return (
    <Pressable style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={styles.optionIcon}>
          <Icon name={icon} size={20} color={BLACK} />
        </View>

        <Text style={styles.optionLabel}>{label}</Text>
      </View>

      <Icon name="arrowRight" size={22} color={BLACK} />
    </Pressable>
  );
}

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";
const ICON_GREEN = "#00d5a0";
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
    paddingTop: 34,
    paddingBottom: 60,
  },

  optionsContainer: {
    gap: 4,
  },

  optionRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ICON_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  optionLabel: {
    fontSize: 15,
    color: BLACK,
    fontFamily: fonts.medium,
  },
});