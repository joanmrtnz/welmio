import { StyleSheet } from "react-native";
import { fonts } from "@/theme/fonts";

const BLACK = "#063b3a";
const MINT = "#10b992";
const PALE_MINT = "#e7f8f2";
const WHITE = "#ffffff";
const MUTED = "#5e7b78";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  overlayDesktop: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  overlayCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: "100%",
    height: "82%",
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 24,
  },
  modalCardDesktop: {
    maxWidth: 720,
    height: "75%",
    maxHeight: 720,
    borderRadius: 22,
    paddingHorizontal: 28,
    paddingTop: 26,
  },
  mappingCard: {
    height: "auto",
    maxHeight: "88%",
    maxWidth: 620,
    borderRadius: 22,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: BLACK,
    fontFamily: fonts.bold,
    fontSize: 20,
  },
  fileName: {
    color: MUTED,
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 4,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: PALE_MINT,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    color: MUTED,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 18,
    marginBottom: 10,
  },
  list: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(9, 169, 130, 0.14)",
  },
  listContent: {
    paddingVertical: 4,
  },
  mappingScroll: {
    flexGrow: 0,
    maxHeight: 430,
  },
  mappingContent: {
    gap: 18,
    paddingVertical: 4,
  },
  mappingSection: {
    gap: 8,
  },
  mappingLabel: {
    color: BLACK,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  mappingOptions: {
    gap: 8,
  },
  mappingOption: {
    minHeight: 46,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(9, 169, 130, 0.16)",
    backgroundColor: WHITE,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  mappingOptionSelected: {
    backgroundColor: PALE_MINT,
    borderColor: MINT,
  },
  mappingOptionText: {
    flex: 1,
    color: BLACK,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  mappingOptionTextSelected: {
    fontFamily: fonts.bold,
  },
  mappingEmpty: {
    color: "#b42318",
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 18,
  },
  button: {
    flex: 1,
    minHeight: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  cancelButton: {
    backgroundColor: PALE_MINT,
  },
  importButton: {
    backgroundColor: MINT,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  cancelText: {
    color: BLACK,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  importText: {
    color: WHITE,
    fontFamily: fonts.bold,
    fontSize: 13,
    textAlign: "center",
  },
});
