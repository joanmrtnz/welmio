import { View, Text, TextInput, StyleSheet } from "react-native";
import { fonts } from "@/theme/fonts";


export function AuthInput({
  label,
  ...props
}: {
  label?: string;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        placeholderTextColor="#768e7e"
        style={styles.input}
      />
    </View>
  );
}

const MEDIUM_GREEN ="#dff7e2";


const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: "#093030",
    fontFamily: fonts.bold,
  },
  input: {
    height: 42,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: MEDIUM_GREEN,
    fontSize: 13,
    fontFamily: fonts.medium,
  },
});
