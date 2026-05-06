import { View, Text, Pressable, StyleSheet } from "react-native";
import { Icon } from "@/components/icons/Icon";
import { fonts } from "@/theme/fonts";

import type { IconName } from "@repo/shared-types";

type OptionProps = {
  icon: IconName;
  label: string;
  onPress?: () => void;
};

const WHITE = "#ffffff";
const DARK = "#082f32";
const MINT = "#12c79b";
const MINT_SOFT = "#e2f8f0";

export function ProfileOption({ icon, label, onPress }: OptionProps) {
  return (
    <Pressable style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={styles.optionIcon}>
          <Icon name={icon} size={25} strokeWidth={1.9} color={MINT} />
        </View>

        <Text style={styles.optionLabel}>{label}</Text>
      </View>

      <Icon name="chevronRight" size={24} strokeWidth={2.1} color={DARK} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionCard: {
    minHeight: 70,
    borderRadius: 18,
    backgroundColor: WHITE,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "rgba(34, 93, 84, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: MINT_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },

  optionLabel: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: DARK,
  },
});
