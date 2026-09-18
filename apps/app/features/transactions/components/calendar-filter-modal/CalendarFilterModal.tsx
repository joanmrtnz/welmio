import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import type { CalendarFilterModalProps, DateRange } from "@repo/shared-types";
import { i18n, t } from "@/lib/i18n";
import { Icon } from "@/components/icons/Icon";
import { styles } from "./calendarFilterModal.styles";
import {
  dateInputValue,
  monthRange,
  parseDateInput,
  presetRange,
  type DatePreset,
} from "../../utils/dateRange";

const PRESETS: DatePreset[] = ["thisMonth", "lastMonth", "thisYear", "allTime"];

export function CalendarFilterModal({
  visible,
  selectedRange,
  onClose,
  onApply,
}: CalendarFilterModalProps) {
  const { width } = useWindowDimensions();
  const desktop = width >= 768;
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [year, setYear] = useState("");
  const [activePreset, setActivePreset] = useState<DatePreset | null>(null);

  function setDraft(range: DateRange) {
    setFrom(dateInputValue(range.startDate));
    setTo(dateInputValue(range.endDate));
  }

  useEffect(() => {
    if (visible) {
      setDraft(selectedRange);
      setYear(String((selectedRange.startDate ?? new Date()).getFullYear()));
      setActivePreset(null);
    }
  }, [visible, selectedRange]);

  const startDate = parseDateInput(from);
  const endDate = parseDateInput(to);
  const allTime = !from && !to;
  const valid =
    allTime || Boolean(startDate && endDate && startDate <= endDate);
  const validYear = /^\d{4}$/.test(year) && Number(year) >= 1000;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.backdrop, desktop && styles.backdropDesktop]}
        onPress={onClose}
      >
        <Pressable
          style={[styles.modalCard, desktop && styles.modalCardDesktop]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {t("transactions.calendarFilter.title")}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("common.cancel")}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Icon name="close" size={15} color="#052e2b" />
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={local.wrap}>
              {PRESETS.map((preset) => (
                <Pressable
                  key={preset}
                  accessibilityRole="button"
                  accessibilityState={{ selected: activePreset === preset }}
                  style={[local.chip, activePreset === preset && local.active]}
                  onPress={() => {
                    const range = presetRange(preset);
                    setDraft(range);
                    setActivePreset(preset);
                    setYear(
                      String((range.startDate ?? new Date()).getFullYear()),
                    );
                  }}
                >
                  <Text style={local.text}>
                    {t(`transactions.browse.${preset}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={local.label}>
              {t("transactions.browse.chooseMonth")}
            </Text>
            <Text style={local.text}>{t("transactions.browse.year")}</Text>
            <TextInput
              accessibilityLabel={t("transactions.browse.year")}
              value={year}
              onChangeText={setYear}
              keyboardType="number-pad"
              maxLength={4}
              placeholder={String(new Date().getFullYear())}
              style={local.input}
            />
            <View style={local.wrap}>
              {Array.from({ length: 12 }, (_, month) => {
                const range = validYear
                  ? monthRange(Number(year), month)
                  : null;
                const selected = Boolean(
                  range &&
                  from === dateInputValue(range.startDate) &&
                  to === dateInputValue(range.endDate),
                );
                return (
                  <Pressable
                    key={month}
                    disabled={!validYear}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !validYear, selected }}
                    style={[
                      local.month,
                      selected && local.active,
                      !validYear && local.disabled,
                    ]}
                    onPress={() => {
                      if (range) {
                        setDraft(range);
                        setActivePreset(null);
                      }
                    }}
                  >
                    <Text style={local.text}>
                      {new Date(2024, month, 1).toLocaleDateString(
                        i18n.locale,
                        { month: "short" },
                      )}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={local.label}>
              {t("transactions.browse.customRange")}
            </Text>
            <Text style={local.hint}>{t("transactions.browse.dateHint")}</Text>
            <View style={local.row}>
              <View style={local.field}>
                <Text style={local.text}>{t("transactions.browse.from")}</Text>
                <TextInput
                  accessibilityLabel={t("transactions.browse.from")}
                  style={local.input}
                  value={from}
                  placeholder={t("transactions.browse.datePlaceholder")}
                  maxLength={10}
                  autoCorrect={false}
                  onChangeText={(value) => {
                    setFrom(value);
                    setActivePreset(null);
                  }}
                />
              </View>
              <View style={local.field}>
                <Text style={local.text}>{t("transactions.browse.to")}</Text>
                <TextInput
                  accessibilityLabel={t("transactions.browse.to")}
                  style={local.input}
                  value={to}
                  placeholder={t("transactions.browse.datePlaceholder")}
                  maxLength={10}
                  autoCorrect={false}
                  onChangeText={(value) => {
                    setTo(value);
                    setActivePreset(null);
                  }}
                />
              </View>
            </View>
            {!valid && (
              <Text accessibilityRole="alert" style={local.error}>
                {t("transactions.browse.invalidRange")}
              </Text>
            )}
          </ScrollView>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              style={styles.clearButton}
              onPress={onClose}
            >
              <Text style={styles.clearButtonText}>{t("common.cancel")}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !valid }}
              disabled={!valid}
              style={[styles.applyButton, !valid && local.disabled]}
              onPress={() => {
                onApply({ startDate, endDate });
                onClose();
              }}
            >
              <Text style={styles.applyButtonText}>
                {t("transactions.calendarFilter.applyFilter")}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const local = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  row: { flexDirection: "row", gap: 12 },
  field: { flex: 1 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#eefbf6",
    borderRadius: 12,
  },
  month: {
    width: "30%",
    minHeight: 44,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#eefbf6",
    borderRadius: 10,
  },
  active: { backgroundColor: "#93e2c9" },
  disabled: { opacity: 0.45 },
  label: { fontSize: 15, fontWeight: "600", color: "#052e2b", marginBottom: 8 },
  text: { color: "#052e2b", fontSize: 14 },
  hint: { color: "#5e7b78", fontSize: 12, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#a4cbbd",
    backgroundColor: "white",
    borderRadius: 10,
    minHeight: 44,
    padding: 12,
    color: "#052e2b",
    marginVertical: 8,
  },
  error: { color: "#a32727", marginBottom: 12 },
});
