import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { fonts } from "@/theme/fonts";


export function AuthInput({
  label,
  ...props
}: {
  label?: string;
} & React.ComponentProps<typeof TextInput>) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        {...props}
        placeholderTextColor="#768e7e"
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
         style={[
          styles.input,
          focused && styles.inputFocused,
        ]}
      />
    </View>
  );
}

const MEDIUM_GREEN ="#dff7e2";
const FOCUS_GREEN = "#d1fae5";


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
    inputFocused: {
    backgroundColor: FOCUS_GREEN,
  },

});
