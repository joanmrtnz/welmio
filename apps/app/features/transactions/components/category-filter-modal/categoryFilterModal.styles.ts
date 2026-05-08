import { StyleSheet } from "react-native";
import { fonts } from "@/theme/fonts";

const WHITE = "#ffffff";
const BLACK = "#052e2b";
const LIGHT_GREEN = "#dff7ef";
const CARD_GREEN = "#f4fff9";
const SOFT_GREEN = "#e4f7ef";
const BUTTON_GREEN = "#80dbc0";
const DARK_GREEN = "#087c6d";
const TAB_GREEN = "#14a98c";
const LIGTH_GRAY = "rgba(5, 46, 43, 0.12)";
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
    backgroundColor: LIGHT_GREEN,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 0,
  },


  backdropDesktop: {
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 32,
  },

  modalCard: {
    width: "100%",
    maxHeight: "91%",
    backgroundColor: CARD_GREEN,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(20, 169, 140, 0.1)",
    shadowColor: "rgba(29, 100, 89, 0.16)",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
  },


  modalCardDesktop: {
    width: "100%",
    maxWidth: 760,
    maxHeight: "86%",
    borderRadius: 34,
    paddingHorizontal: 32,
    paddingTop: 30,
    paddingBottom: 28,
  },

  scrollView: {
    width: "100%",
  },

  scrollContent: {
    paddingBottom: 10,
  },


  scrollContentDesktop: {
    paddingBottom: 14,
  },

  formScrollContentDesktop: {
    paddingBottom: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  title: {
    fontSize: 21,
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 28,
    marginBottom: 28,
  },


  gridDesktop: {
    justifyContent: "center",
    columnGap: 18,
    rowGap: 26,
    marginBottom: 30,
  },

  gridItem: {
    width: "31%",
    alignItems: "center",
  },


  gridItemDesktop: {
    width: "18%",
  },

  gridIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 0,
  },

  gridIconSelected: {
    backgroundColor: "#bdebdc",
    shadowColor: "rgba(20, 169, 140, 0.18)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 5,
  },

  gridLabel: {
    width: "100%",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.bold,
    color: BLACK,
    textAlign: "center",
  },

  gridLabelSelected: {
    color: DARK_GREEN,
  },

  addMoreButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: WHITE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 2,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "rgba(20, 169, 140, 0.18)",
  },


  addMoreButtonDesktop: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 360,
    marginBottom: 10,
  },

  addMoreText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  input: {
    height: 50,
    borderRadius: 16,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    marginBottom: 18,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: BLACK,
    borderWidth: 1,
    borderColor: "rgba(5, 46, 43, 0.08)",
  },

  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: BLACK,
    marginBottom: 10,
  },

  typeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  typeButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(20, 169, 140, 0.18)",
  },

  typeButtonSelected: {
    backgroundColor: "#bdebdc",
    borderColor: "transparent",
  },

  typeButtonText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  typeButtonTextSelected: {
    color: BLACK,
  },

  iconSelectorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 18,
  },

  iconOption: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },

  iconOptionSelected: {
    backgroundColor: "#bdebdc",
  },

  iconOptionLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  iconOptionLabelSelected: {
    color: BLACK,
    fontFamily: fonts.bold,
  },

  colorSelectorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },

  colorOptionSelected: {
    borderColor: BLACK,
  },

  actions: {
    flexDirection: "row",
    gap: 14,
    marginTop: 8,
  },


  actionsDesktop: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 460,
  },

  clearButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  clearButtonText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  applyButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonDisabled: {
    opacity: 0.5,
  },

  applyButtonText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },

  deleteIconButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
});
