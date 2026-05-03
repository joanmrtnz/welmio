import {
  View,
  Text,
  Pressable,
} from "react-native";
import { Icon } from "@/components/icons/Icon";
import { StyleSheet } from "react-native";
import { fonts } from "@/theme/fonts";

type OptionProps = {
  icon: any;
  label: string;
  onPress?: () => void;
};

export function ProfileOption({ icon, label, onPress }: OptionProps) {
  return (
    <Pressable style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionIcon}>
        <Icon name={icon} size={26} color={WHITE} />
      </View>

      <Text style={styles.optionLabel}>{label}</Text>
    </Pressable>
  );
}

const WHITE = "#ffffff";
const BLACK = "#052e2b";
const BUTTON_GREEN = "#1A9E6A";


const styles = StyleSheet.create({
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 22,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },

  optionLabel: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: BLACK,
  },
});
