import { Pressable, Text, StyleSheet } from "react-native";

export function AuthButton({
  title,
  variant = "primary",
  onPress,
}: {
  title: string;
  variant?: "primary" | "secondary";
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
      ]}
    >
      <Text
        style={styles.text}
      >
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
  text: {
    fontSize: 14,
    fontWeight: "700",
    color: "#052e2b",
  },
});
