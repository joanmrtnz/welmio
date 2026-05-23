import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { fonts } from "@/theme/fonts";
import { DateOfBirthInputProps } from "./dateOfBirthInput.types";

const TEXT = "#073b3a";
const INPUT_BG = "#ffffff";
const INPUT_BORDER = "rgba(7, 59, 58, 0.12)";


function formatDateForInput(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day} / ${month} / ${year}`;
}

function parseDateForPicker(value: string) {
  const [day, month, year] = value
    .split("/")
    .map((part) => Number(part.trim()));

  if (!day || !month || !year) {
    return new Date(2000, 0, 1);
  }

  return new Date(year, month - 1, day);
}

export function DateOfBirthInput({
  label,
  icon,
  value,
  placeholder,
  onChangeText,
}: DateOfBirthInputProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  function handleValueChange(
    _event: DateTimePickerChangeEvent,
    selectedDate: Date
  ) {
    setShowDatePicker(false);
    onChangeText(formatDateForInput(selectedDate));
  }

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      <Pressable
        accessibilityRole="button"
        hitSlop={6}
        onPress={() => setShowDatePicker(true)}
        style={styles.inputShell}
      >
        <FontAwesome
          name={icon}
          size={18}
          style={styles.inputIcon}
          color="rgba(7, 59, 58, 0.42)"
        />

        <Text style={[styles.input, !value && styles.inputPlaceholder]}>
          {value || placeholder}
        </Text>
      </Pressable>

      {showDatePicker ? (
        <DateTimePicker
          value={parseDateForPicker(value)}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onValueChange={handleValueChange}
          onDismiss={() => setShowDatePicker(false)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
  },

  inputLabel: {
    color: TEXT,
    fontSize: 13,
    fontFamily: fonts.semibold,
  },

  inputShell: {
    height: 49,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: INPUT_BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    minWidth: 0,
    color: TEXT,
    fontSize: 14,
    fontFamily: fonts.regular,
    paddingVertical: 0,
  },

  inputPlaceholder: {
    color: "rgba(7, 59, 58, 0.42)",
  },

  inputIcon: {
    width: 23,
    borderRightColor: "rgba(5, 46, 43, 0.12)",
    borderRightWidth: 1.5,
    marginRight: 5,
  },
});
