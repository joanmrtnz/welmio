import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Icon } from "@/components/icons/Icon";
import { fonts } from "@/theme/fonts";
import type { DevToolAction } from "../constants/devToolActions";

type DevToolActionButtonProps = {
  action: DevToolAction;
  isLoading: boolean;
  onPress: (action: DevToolAction) => void;
};

const DARK_TEAL = "#063b3a";
const MUTED = "#5e7b78";
const CARD = "#fbfffd";
const TEAL = "#00c896";
const DANGER = "#ef4444";
const BORDER = "rgba(6, 59, 58, 0.1)";

export function DevToolActionButton({
  action,
  isLoading,
  onPress,
}: DevToolActionButtonProps) {
  const accentColor = action.destructive ? DANGER : TEAL;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !isLoading && styles.buttonPressed,
        isLoading && styles.buttonLoading,
      ]}
      disabled={isLoading}
      onPress={() => onPress(action)}
    >
      <View style={[styles.iconBadge, { borderColor: accentColor }]}>
        {isLoading ? (
          <ActivityIndicator size="small" color={accentColor} />
        ) : (
          <Icon name={action.icon} size={action.iconSize} color={accentColor} />
        )}
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.label} numberOfLines={1}>
          {action.label}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {action.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 76,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  buttonPressed: {
    opacity: 0.74,
    transform: [{ scale: 0.99 }],
  },

  buttonLoading: {
    opacity: 0.86,
  },

  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  textWrap: {
    flex: 1,
    minWidth: 0,
  },

  label: {
    color: DARK_TEAL,
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 20,
  },

  description: {
    color: MUTED,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
});
