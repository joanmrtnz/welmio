import { StyleSheet } from "react-native";
import { fonts } from "@/theme/fonts";

const WHITE = "#ffffff";
const BLACK = "#052e2b";
const LIGHT_GREEN = "#eefbf6";
const CARD_GREEN = "rgba(255, 255, 255, 0.78)";
const SOFT_GREEN = "#d8f5ea";
const BUTTON_GREEN = "#93e2c9";
const DARK_GREEN = "#00a87d";
const TAB_GREEN = "#12c79b";
const BORDER_GREEN = "rgba(8, 120, 98, 0.14)";

export const calendarFilterModalColors = {
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
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  backdropDesktop: {
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  modalCard: {
    width: "100%",
    maxHeight: "94%",
    backgroundColor: CARD_GREEN,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    overflow: "hidden",
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: -8 },
    elevation: 10,
  },

  modalCardDesktop: {
    maxWidth: 620,
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingTop: 30,
    paddingBottom: 28,
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: BLACK,
    letterSpacing: 0.2,
  },

  titleDesktop: {
    fontSize: 22,
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: SOFT_GREEN,
    justifyContent: "center",
    alignItems: "center",
  },

  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  monthArrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: SOFT_GREEN,
    justifyContent: "center",
    alignItems: "center",
  },

  monthTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  monthTitleDesktop: {
    fontSize: 18,
  },

  weekDaysRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  weekDayText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 12,
    fontFamily: fonts.bold,
    color: "rgba(5, 46, 43, 0.55)",
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
    marginBottom: 24,
  },

  daysGridDesktop: {
    rowGap: 10,
    marginBottom: 28,
  },

  dayCell: {
    width: `${100 / 7}%`,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  dayCellDesktop: {
    height: 48,
  },

  dayCellBetween: {
    backgroundColor: "rgba(18, 199, 155, 0.18)",
  },

  dayCellSelected: {
    backgroundColor: TAB_GREEN,
    borderRadius: 21,
  },

  dayCellSelectedDesktop: {
    borderRadius: 24,
  },

  dayCellStart: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  dayCellEnd: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  dayText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  dayTextBetween: {
    color: BLACK,
  },

  dayTextSelected: {
    color: WHITE,
  },

  actions: {
    flexDirection: "row",
    gap: 14,
    marginTop: 4,
  },

  actionsDesktop: {
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
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
    color: BLACK,
    fontSize: 14,
    fontFamily: fonts.bold,
  },

  applyButton: {
    flex: 1,
    height: 50,
    borderRadius: 13,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonText: {
    color: BLACK,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});
