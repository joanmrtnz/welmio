import { StyleSheet } from "react-native";
import { fonts } from "@/theme/fonts";

const WHITE = "#ffffff";
const BLACK = "#052e2b";
const LIGHT_GREEN = "#f1fff3";
const BUTTON_GREEN = "#1A9E6A";
const DARK_GREEN = "#059669";
const TAB_GREEN = "#14cfa1";
const LIGTH_GRAY = "rgba(0,0,0,0.1)";
const RED = "#ef4444";

export const categoryFilterModalColors = {
  WHITE,
  BLACK,
  LIGHT_GREEN,
  BUTTON_GREEN,
  DARK_GREEN,
  TAB_GREEN,
  LIGTH_GRAY,
  RED,
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
    maxHeight: "82%",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 20,
    overflow: "hidden",
  },

  scrollView: {
    width: "100%",
  },

  scrollContent: {
    paddingBottom: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  gridItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 22,
  },

  gridIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: BUTTON_GREEN,
  },

  gridIconSelected: {
    backgroundColor: TAB_GREEN,
  },

  gridLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: BLACK,
    textAlign: "center",
  },

  gridLabelSelected: {
    color: DARK_GREEN,
  },

  addMoreButton: {
    height: 46,
    borderRadius: 16,
    backgroundColor: LIGHT_GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  addMoreText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
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

  sectionLabel: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: BLACK,
    marginBottom: 8,
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
    borderColor: TAB_GREEN,
  },

  typeButtonText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  typeButtonTextSelected: {
    color: WHITE,
  },

  iconSelectorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 10,
    marginBottom: 16,
  },

  iconOption: {
    width: "25%",
    height: 60,
    borderRadius: 18,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  iconOptionSelected: {
    backgroundColor: DARK_GREEN,
    borderColor: DARK_GREEN,
  },

  iconOptionLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  iconOptionLabelSelected: {
    color: WHITE,
    fontFamily: fonts.bold,
  },

  colorSelectorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },

  colorOptionSelected: {
    borderColor: BLACK,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
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

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  deleteIconButton: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderColor: "rgba(239, 68, 68, 0.25)",
  },
});