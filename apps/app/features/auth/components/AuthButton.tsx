import { Pressable, Text, StyleSheet } from "react-native";

type AuthButtonVariant = "primary" | "secondary" | "danger";

export function AuthButton({
  title,
  variant = "primary",
  onPress,
  disabled = false,
}: {
  title: string;
  variant?: AuthButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const isDanger = variant === "danger";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        disabled && styles.disabledButton,
      ]}
    >
      <Text
        style={[
          styles.text,
          isDanger && styles.dangerText,
          disabled && styles.disabledText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const WHITE = "#ffffff";
const RED = "#ef4444";
const BLACK = "#052e2b";

const styles = StyleSheet.create({
  base: {
    height: 42,
    width: 182,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  primary: {
    backgroundColor: "#00c896",
  },

  secondary: {
    backgroundColor: "#dff7e2",
  },

  danger: {
    backgroundColor: RED,
  },

  disabledButton: {
    backgroundColor: "#cfeee0",
  },

  text: {
    fontSize: 14,
    fontWeight: "700",
    color: BLACK,
  },

  dangerText: {
    color: WHITE,
  },

  disabledText: {
    color: "rgba(5, 46, 43, 0.45)",
  },
});