import { StyleSheet } from "react-native";
import { fonts } from "@/theme/fonts";

const WHITE = "#ffffff";
const BLACK = "#052e2b";
const LIGHT_GREEN = "#f1fff3";
const BUTTON_GREEN = "#1A9E6A";
const DARK_GREEN = "#059669";
const TAB_GREEN = "#14cfa1";
const LIGTH_GRAY = "rgba(0,0,0,0.1)";


export const createTransactionModalColors = {
  WHITE,
  BLACK,
  LIGHT_GREEN,
  BUTTON_GREEN,
  DARK_GREEN,
  TAB_GREEN,
  LIGTH_GRAY,
};

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modalCard: {
    width: "100%",
    maxHeight: "86%",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LIGTH_GRAY,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    width: "100%",
    padding: 2,
  },

  content: {
    paddingBottom: 4,
  },

  sectionLabel: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: BLACK,
    marginBottom: 8,
  },

  input: {
    height: 44,
    borderRadius: 16,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  amountRow: {
    flexDirection: "row",
    gap: 10,
  },

  amountInput: {
    flex: 1,
  },

  currencyInput: {
    width: 82,
    textAlign: "center",
  },

  typeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  typeButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  typeButtonSelected: {
    backgroundColor: TAB_GREEN,
  },

  typeButtonText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  typeButtonTextSelected: {
    color: WHITE,
    fontFamily: fonts.semibold,
  },

  selectorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },

  selectorOption: {
    width: "30%",
    height: 68,
    borderRadius: 18,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  selectorOptionSelected: {
    backgroundColor: BUTTON_GREEN,
    borderColor: BUTTON_GREEN,
  },

  selectorOptionText: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: BLACK,
    maxWidth: "90%",
  },

  selectorOptionTextSelected: {
    color: WHITE,
    fontFamily: fonts.bold,
  },

  optionColumn: {
    gap: 10,
    marginBottom: 16,
  },

  accountOption: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  accountOptionSelected: {
    backgroundColor: DARK_GREEN,
    borderColor: DARK_GREEN,
  },

  accountName: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  accountNameSelected: {
    color: WHITE,
  },

  accountMeta: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: BLACK,
    marginTop: 2,
    textTransform: "capitalize",
  },

  accountMetaSelected: {
    color: WHITE,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  chip: {
    height: 34,
    borderRadius: 14,
    backgroundColor: WHITE,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  chipSelected: {
    backgroundColor: TAB_GREEN,
    borderColor: TAB_GREEN,
  },

  chipText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  chipTextSelected: {
    color: WHITE,
  },

  textArea: {
    minHeight: 96,
    borderRadius: 16,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },

  clearButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: LIGTH_GRAY,
    alignItems: "center",
    justifyContent: "center",
  },

  clearButtonText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  applyButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: TAB_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonDisabled: {
    opacity: 0.5,
  },

  applyButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: WHITE,
  },
});