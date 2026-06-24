import { View, Text, Pressable, StyleSheet } from "react-native";
import { Icon } from "@/components/icons/Icon";
import { fonts } from "@/theme/fonts";

const TEAL = "#00c896";
const DARK_TEAL = "#063b3a";
const SOFT_TEAL = "#a9efdf";
const MUTED = "#5e7b78";

const LOGOUT = "#ef8f8f";
const LOGOUT_BG = "#ffe9e9";

type OptionProps = {
  icon: any;
  label: string;
  size?: number,
  onPress?: () => void;
};

export function ProfileOption({ icon, label, size=23, onPress }: OptionProps) {
  const isLogout = icon === "logout";

  return (
    <Pressable style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={[styles.optionIcon, isLogout && styles.logoutIcon]}>
          <Icon
            name={icon}
            size={size}
            strokeWidth={1.7}
            color={isLogout ? LOGOUT : TEAL}
          />
        </View>

        <Text style={[styles.optionLabel, isLogout && styles.logoutLabel]}>
          {label}
        </Text>
      </View>

      <View style={styles.chevronWrap}>
        <Icon name="chevronRight" size={19} strokeWidth={2} color={MUTED} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  optionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: SOFT_TEAL,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  logoutIcon: {
    backgroundColor: LOGOUT_BG,
  },

  optionLabel: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: DARK_TEAL,
  },

  logoutLabel: {
    color: DARK_TEAL,
  },

  chevronWrap: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
