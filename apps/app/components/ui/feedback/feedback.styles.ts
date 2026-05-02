import { StyleSheet } from "react-native";
import { fonts } from "@/theme/fonts";

const WHITE = "#ffffff";
const BLACK = "#052e2b";
const LIGTH_GRAY = "rgba(0,0,0,0.1)";
const SUCCESS_GREEN = "#7fffd4";
const ERROR_RED = "#ef4444";
const WARNING_YELLOW = "#f59e0b";


export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  toastWrapper: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    elevation: 9999,
    alignItems: "center",
  },

  toast: {
    minHeight: 46,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "100%",
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  toastText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    textAlign: "center",
  },

  toastText_success: {
    color: BLACK,
  },

  toastText_error: {
    color: WHITE,
  },

  toastText_info: {
    color: WHITE,
  },

  toastText_warning: {
    color: BLACK,
  },

  success: {
    backgroundColor: SUCCESS_GREEN,
  },

  error: {
    backgroundColor: ERROR_RED,
  },

  info: {
    backgroundColor: BLACK,
  },

  warning: {
    backgroundColor: WARNING_YELLOW,
  },
});