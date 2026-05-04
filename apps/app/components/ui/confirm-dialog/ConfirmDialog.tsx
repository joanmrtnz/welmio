import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fonts } from "@/theme/fonts";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Pressable
              style={[
                styles.button,
                destructive ? styles.destructiveButton : styles.confirmButton,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const GREEN = "#00c896";
const LIGHT_GREEN = "#dff6e3";
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const OVERLAY = "rgba(0, 0, 0, 0.72)";
const DESTRUCTIVE = "#ef4444";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: OVERLAY,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  dialog: {
    width: "100%",
    maxWidth: 330,
    backgroundColor: WHITE,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 28,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    color: BLACK,
    fontFamily: fonts.bold,
    textAlign: "center",
    marginBottom: 24,
  },

  message: {
    fontSize: 14,
    color: BLACK,
    fontFamily: fonts.regular,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },

  actions: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },

  button: {
    width: "82%",
    height: 42,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmButton: {
    backgroundColor: GREEN,
  },

  destructiveButton: {
    backgroundColor: GREEN,
  },

  cancelButton: {
    width: "82%",
    height: 42,
    borderRadius: 22,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmText: {
    fontSize: 13,
    color: BLACK,
    fontFamily: fonts.medium,
  },

  cancelText: {
    fontSize: 13,
    color: BLACK,
    fontFamily: fonts.medium,
  },
});