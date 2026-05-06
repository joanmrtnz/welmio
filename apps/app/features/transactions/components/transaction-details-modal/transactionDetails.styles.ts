import { StyleSheet } from "react-native";
import { fonts } from "@/theme/fonts";

export const WHITE = "#ffffff";
export const BLACK = "#073a36";
export const LIGHT_GREEN = "#dff7ef";
export const CARD_GREEN = "#f3fffa";
export const SOFT_GREEN = "#d9f5eb";
export const BUTTON_GREEN = "#83dcc5";
export const DARK_GREEN = "#0a8f72";
export const TAB_GREEN = "#12c79b";
export const BORDER_GREEN = "rgba(7, 58, 54, 0.1)";
export const MUTED = "rgba(7, 58, 54, 0.62)";
export const RED = "#ef4444";

export const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(223, 247, 239, 0.68)",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 58, 54, 0.1)",
  },

  modalCard: {
    width: "100%",
    maxHeight: "88%",
    backgroundColor: CARD_GREEN,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    shadowColor: "rgba(29, 100, 89, 0.16)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
    gap: 12,
  },

  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
    letterSpacing: 0.2,
  },

  subtitle: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: MUTED,
    marginTop: 5,
  },

  headerActions: {
    flexDirection: "row",
    gap: 6,
    flexShrink: 0,
  },

  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteIconButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },

  scrollView: {
    width: "100%",
  },

  content: {
    paddingBottom: 10,
  },

  heroCard: {
    backgroundColor: WHITE,
    borderRadius: 26,
    paddingVertical: 24,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(7, 58, 54, 0.06)",
    shadowColor: "rgba(29, 100, 89, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  categoryIcon: {
    width: 86,
    height: 86,
    borderRadius: 24,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  description: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
    textAlign: "center",
    marginBottom: 6,
  },

  amount: {
    fontSize: 28,
    fontFamily: fonts.bold,
    marginBottom: 12,
    letterSpacing: 0.3,
  },

  incomeAmount: {
    color: DARK_GREEN,
  },

  expenseAmount: {
    color: BLACK,
  },

  typeBadge: {
    minHeight: 30,
    borderRadius: 15,
    backgroundColor: SOFT_GREEN,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  typeBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: DARK_GREEN,
    letterSpacing: 0.5,
  },

  detailsCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(7, 58, 54, 0.06)",
    shadowColor: "rgba(29, 100, 89, 0.06)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  detailRow: {
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(7, 58, 54, 0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },



  detailRowLast: {
    borderBottomWidth: 0,
  },

  detailLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: MUTED,
  },

  detailValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  notesCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(7, 58, 54, 0.06)",
    shadowColor: "rgba(29, 100, 89, 0.06)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  notesLabel: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
    marginBottom: 8,
  },

  notesText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: MUTED,
    lineHeight: 20,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },

  editButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: BUTTON_GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  editButtonText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  deleteButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  deleteButtonText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: RED,
  },
});
