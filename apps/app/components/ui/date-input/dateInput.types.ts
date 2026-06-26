import type { ComponentProps } from "react";
import type { FontAwesome } from "@expo/vector-icons";

export type DateInputProps = {
  label: string;
  icon: ComponentProps<typeof FontAwesome>["name"];
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  pickerDefaultDate?: Date;
};
