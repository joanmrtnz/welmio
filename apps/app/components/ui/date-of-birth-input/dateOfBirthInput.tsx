import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { fonts } from "@/theme/fonts";
import { DateOfBirthInputProps } from "./dateOfBirthInput.types";

const TEXT = "#073b3a";
const INPUT_BG = "#ffffff";
const INPUT_BORDER = "rgba(7, 59, 58, 0.12)";

const WEB_DATE_INPUT_STYLE: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  color: TEXT,
  fontSize: 14,
  fontFamily: fonts.regular,
};

function formatDateForInput(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day} / ${month} / ${year}`;
}

function formatDateForWebInput(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

function formatDateFromWebInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!day || !month || !year) {
    return "";
  }

  return formatDateForInput(new Date(year, month - 1, day));
}

function parseDateForWebInput(value: string) {
  const [day, month, year] = value
    .split("/")
    .map((part) => Number(part.trim()));

  if (!day || !month || !year) {
    return "";
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

export function DateOfBirthInput({
  label,
  icon,
  value,
  placeholder,
  onChangeText,
}: DateOfBirthInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      <View style={styles.inputShell}>
        <FontAwesome
          name={icon}
          size={18}
          style={styles.inputIcon}
          color="rgba(7, 59, 58, 0.42)"
        />

        {React.createElement("input", {
          type: "date",
          value: parseDateForWebInput(value),
          max: formatDateForWebInput(new Date()),
          placeholder,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            onChangeText(formatDateFromWebInput(event.target.value));
          },
          style: WEB_DATE_INPUT_STYLE,
          "aria-label": label,
        })}
      </View>
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

  inputIcon: {
    width: 23,
    borderRightColor: "rgba(5, 46, 43, 0.12)",
    borderRightWidth: 1.5,
    marginRight: 5,
  },
});
