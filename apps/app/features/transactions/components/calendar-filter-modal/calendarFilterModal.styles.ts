import { StyleSheet } from "react-native";

const WHITE = "#FFFFFF";
const BLACK = "#052E2B";
const LIGHT_GREEN = "#EAF8F3";
const BUTTON_GREEN = "#052E2B";
const TAB_GREEN = "#14CFA1";
const LIGTH_GRAY = "#E6E6E6";

export const calendarFilterModalColors = {
  WHITE,
  BLACK,
  LIGHT_GREEN,
  BUTTON_GREEN,
  TAB_GREEN,
  LIGTH_GRAY,
};

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 28,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: BLACK,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: WHITE,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: WHITE,
    justifyContent: "center",
    alignItems: "center",
  },

  monthTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: BLACK,
  },

  weekDaysRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  weekDayText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(5, 46, 43, 0.55)",
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
    marginBottom: 24,
  },

  dayCell: {
    width: `${100 / 7}%`,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  dayCellBetween: {
    backgroundColor: "rgba(20, 207, 161, 0.18)",
  },

  dayCellSelected: {
    backgroundColor: TAB_GREEN,
    borderRadius: 21,
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
    fontWeight: "600",
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
    gap: 12,
  },

  clearButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },

  clearButtonText: {
    color: BLACK,
    fontSize: 15,
    fontWeight: "700",
  },

  applyButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "700",
  },
});