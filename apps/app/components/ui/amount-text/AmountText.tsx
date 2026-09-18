import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextProps,
} from "react-native";
import { t } from "@/lib/i18n";

type AmountTextProps = Omit<TextProps, "children"> & {
  /** Format the same value (or translated sentence) in compact and full form. */
  formatValue: (compact: boolean) => string;
};

export function AmountText({ formatValue, ...textProps }: AmountTextProps) {
  const compactText = formatValue(true);
  const exactText = formatValue(false);
  const abbreviated =
    compactText !== exactText && /\d\s*[kKmM]\b/.test(compactText);
  const [visible, setVisible] = useState(false);
  const textRef = useRef<Text>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    // React Native Web doesn't forward the HTML title prop. Its Text ref is
    // the DOM element; use the browser tooltip so it can't be clipped by cards.
    const element = textRef.current as unknown as HTMLElement | null;
    if (abbreviated) element?.setAttribute("title", exactText);
    else element?.removeAttribute("title");
  }, [abbreviated, exactText]);

  return (
    <>
      <Text
        {...textProps}
        ref={textRef}
        accessibilityRole={abbreviated ? "button" : textProps.accessibilityRole}
        accessibilityLabel={
          abbreviated ? exactText : textProps.accessibilityLabel
        }
        accessibilityHint={
          abbreviated ? t("common.showExactAmount") : undefined
        }
        tabIndex={abbreviated ? 0 : undefined}
        onPress={
          abbreviated
            ? (event) => {
                event.stopPropagation();
                setVisible(true);
              }
            : textProps.onPress
        }
      >
        {compactText}
      </Text>
      {abbreviated && visible && (
        <Modal
          transparent
          visible
          animationType="fade"
          onRequestClose={() => setVisible(false)}
        >
          <Pressable
            style={styles.backdrop}
            onPress={(event) => {
              event.stopPropagation();
              setVisible(false);
            }}
            accessible={false}
          >
            <Pressable
              style={styles.card}
              accessible={false}
              onPress={(event) => event.stopPropagation()}
              accessibilityViewIsModal
            >
              <Text style={styles.label}>{t("common.exactAmount")}</Text>
              <Text selectable style={styles.amount}>
                {exactText}
              </Text>
              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  style={styles.close}
                  onPress={(event) => {
                    event.stopPropagation();
                    setVisible(false);
                  }}
                >
                  <Text style={styles.closeText}>{t("common.close")}</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(6, 59, 58, 0.22)",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#fbfffd",
    borderWidth: 1,
    borderColor: "#a4cbbd",
    gap: 12,
  },
  label: { color: "#5e7b78", fontSize: 13 },
  amount: { color: "#063b3a", fontSize: 20, fontWeight: "600" },
  actions: { alignItems: "flex-end" },
  close: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#e4f5ed",
    borderWidth: 1,
    borderColor: "#a4cbbd",
  },
  closeText: { color: "#063b3a", fontWeight: "600" },
});
