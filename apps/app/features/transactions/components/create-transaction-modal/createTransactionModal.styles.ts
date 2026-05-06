import { StyleSheet } from "react-native";
import { fonts } from "@/theme/fonts";

const WHITE = "#ffffff";
const BLACK = "#052e2b";
const LIGHT_GREEN = "#eefbf6";
const SOFT_GREEN = "#d8f5ea";
const BUTTON_GREEN = "#93e2c9";
const DARK_GREEN = "#00a87d";
const TAB_GREEN = "#12c79b";
const BORDER_GREEN = "rgba(8, 120, 98, 0.14)";

export const createTransactionModalColors = {
  WHITE,
  BLACK,
  LIGHT_GREEN,
  BUTTON_GREEN,
  DARK_GREEN,
  TAB_GREEN,
  LIGTH_GRAY: BORDER_GREEN,
};

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(223, 247, 239, 0.96)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  modalCard: {
    width: "100%",
    maxHeight: "94%",
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: BLACK,
    letterSpacing: 0.2,
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    width: "100%",
  },

  content: {
    paddingBottom: 4,
  },

  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: BLACK,
    marginBottom: 10,
    marginTop: 2,
  },

  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: BLACK,
    shadowColor: "rgba(29, 100, 89, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  amountRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  amountInput: {
    flex: 1,
    minWidth: 0,
  },

  currencyInput: {
    width: 72,
    flexShrink: 0,
    textAlign: "center",
    paddingHorizontal: 8,
  },

  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },

  typeButton: {
    minWidth: 102,
    height: 38,
    borderRadius: 15,
    backgroundColor: WHITE,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER_GREEN,
  },

  typeButtonSelected: {
    backgroundColor: BUTTON_GREEN,
    borderColor: BUTTON_GREEN,
  },

  typeButtonText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  typeButtonTextSelected: {
    color: BLACK,
    fontFamily: fonts.semibold,
  },

  selectorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
    justifyContent: "space-around"
  },

  selectorOption: {
    width: 94,
    height: 82,
    borderRadius: 16,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 0,
    paddingHorizontal: 8,
    overflow: "hidden",
  },

  selectorOptionSelected: {
    backgroundColor: SOFT_GREEN,
  },

  selectorOptionText: {
    width: "100%",
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: BLACK,
    textAlign: "center",
  },

  selectorOptionTextSelected: {
    color: BLACK,
    fontFamily: fonts.semibold,
  },

  optionColumn: {
    gap: 12,
    marginBottom: 18,
  },

  accountOption: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  accountOptionSelected: {
    backgroundColor: SOFT_GREEN,
    borderColor: "transparent",
  },

  accountName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  accountNameSelected: {
    color: BLACK,
  },

  accountMeta: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: DARK_GREEN,
    marginTop: 2,
    textTransform: "capitalize",
  },

  accountMetaSelected: {
    color: DARK_GREEN,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  chip: {
    height: 34,
    borderRadius: 13,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER_GREEN,
  },

  chipSelected: {
    backgroundColor: BUTTON_GREEN,
    borderColor: BUTTON_GREEN,
  },

  chipText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  chipTextSelected: {
    color: BLACK,
  },

  textArea: {
    minHeight: 114,
    borderRadius: 14,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 26,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: BLACK,
    shadowColor: "rgba(29, 100, 89, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  actions: {
    flexDirection: "row",
    gap: 14,
    marginTop: 0,
  },

  clearButton: {
    flex: 1,
    height: 50,
    borderRadius: 13,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  clearButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  applyButton: {
    flex: 1,
    height: 50,
    borderRadius: 13,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",

  },

  applyButtonDisabled: {
    opacity: 0.5,
  },

  applyButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
  },
});
