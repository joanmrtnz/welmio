import { Pressable, Text, StyleSheet } from "react-native";

export function AuthButton({
  title,
  variant = "primary",
  onPress,
  disabled = false,
}: {
  title: string;
  variant?: "primary" | "secondary";
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        disabled && styles.disabledButton,
      ]}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {title}
      </Text>
    </Pressable>
  );
}

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

  disabledButton: {
    backgroundColor: "#cfeee0",
  },

  text: {
    fontSize: 14,
    fontWeight: "700",
    color: "#052e2b",
  },

  disabledText: {
    color: "rgba(5, 46, 43, 0.45)",
  },
});