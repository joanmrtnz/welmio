import { StyleSheet } from "react-native";
import { fonts } from "@/theme/fonts";

export const WHITE = "#ffffff";
export const BLACK = "#052e2b";
export const LIGHT_GREEN = "#f1fff3";
export const BUTTON_GREEN = "#1A9E6A";
export const DARK_GREEN = "#059669";
export const TAB_GREEN = "#14cfa1";
export const LIGTH_GRAY = "rgba(0,0,0,0.1)";
export const RED = "#ef4444";

export const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  modalCard: {
    width: "100%",
    maxHeight: "84%",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  subtitle: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
    opacity: 0.65,
    marginTop: 3,
  },

  headerActions: {
    flexDirection: "row",
    gap: 8,
  },

  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LIGTH_GRAY,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteIconButton: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },

  scrollView: {
    width: "100%",
  },

  content: {
    paddingBottom: 24,
  },

  heroCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  categoryIcon: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: BLACK,
    textAlign: "center",
    marginBottom: 6,
  },

  amount: {
    fontSize: 24,
    fontFamily: fonts.bold,
    marginBottom: 10,
  },

  incomeAmount: {
    color: DARK_GREEN,
  },

  expenseAmount: {
    color: BLACK,
  },

  typeBadge: {
    height: 28,
    borderRadius: 14,
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  typeBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: DARK_GREEN,
  },

  detailsCard: {
    backgroundColor: WHITE,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 14,
  },

  detailRow: {
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: LIGTH_GRAY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },

  detailLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
    opacity: 0.65,
  },

  detailValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  notesCard: {
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },

  notesLabel: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: BLACK,
    marginBottom: 8,
  },

  notesText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
    lineHeight: 18,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },

  editButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: TAB_GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  editButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: WHITE,
  },

  deleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  deleteButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: RED,
  },
});