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
import { useState, useEffect } from "react";

import { Icon } from "@/components/icons/Icon";
import { DateOfBirthInput } from "@/components/ui/date-of-birth-input/dateOfBirthInput";
import { t } from "@/lib/i18n";
import { fonts } from "@/theme/fonts";

import {
  CreateGoalPayload,
  GoalOverviewItem,
  GoalType,
} from "@repo/shared-types";

const WHITE = "#ffffff";
const BLACK = "#052e2b";
const LIGHT_GREEN = "#eefbf6";
const SOFT_GREEN = "#d8f5ea";
const BUTTON_GREEN = "#93e2c9";
const TAB_GREEN = "#12c79b";
const BORDER_GREEN = "rgba(8, 120, 98, 0.14)";
const MUTED = "rgba(5, 46, 43, 0.58)";
const DESKTOP_BREAKPOINT = 768;

type CreateGoalModalMode = "create" | "edit";

type CreateGoalModalProps = {
  visible: boolean;
  mode?: CreateGoalModalMode;
  goal?: GoalOverviewItem | null;
  onClose: () => void;
  onSubmit: (payload: CreateGoalPayload) => Promise<void>;
  onUpdate?: (goalId: string, payload: CreateGoalPayload) => Promise<void>;
};

const goalTypes = [
  { value: "savings" },
  { value: "emergency_fund" },
  { value: "purchase" },
  { value: "investment" },
] as const;

const goalIcons = [
  { name: "savings" },
  { name: "shield" },
  { name: "gift" },
  { name: "income" },
  { name: "money" },
  { name: "rent" },
  { name: "car" },
  { name: "plane" },
  { name: "book" },
  { name: "calendar" },
] as const;

function formatIsoDateForDatePicker(value: string) {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day} / ${month} / ${year}`;
}

function formatDatePickerValueToIso(value: string) {
  const [day, month, year] = value.split(" / ");

  if (!day || !month || !year) {
    return value;
  }

  return `${year}-${month}-${day}`;
}

function formatDateToIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayDate() {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function getMaxTargetDate() {
  const maxDate = getTodayDate();

  maxDate.setFullYear(maxDate.getFullYear() + 100);

  return maxDate;
}

function getTodayIsoDate() {
  return formatDateToIsoDate(getTodayDate());
}

function getMaxTargetDateIso() {
  return formatDateToIsoDate(getMaxTargetDate());
}

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  return parsedDate;
}

function isCompleteIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isTargetDateAllowed(value: string) {
  const targetDate = parseIsoDate(value);
  const today = parseIsoDate(getTodayIsoDate());
  const maxTargetDate = parseIsoDate(getMaxTargetDateIso());

  if (!targetDate || !today || !maxTargetDate) {
    return false;
  }

  return targetDate >= today && targetDate <= maxTargetDate;
}

export function CreateGoalModal({
  visible,
  mode = "create",
  goal = null,
  onClose,
  onSubmit,
  onUpdate,
}: CreateGoalModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const isEditMode = mode === "edit";
  const targetDateMinimumDate = getTodayDate();
  const targetDateMaximumDate = getMaxTargetDate();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [selectedType, setSelectedType] = useState<GoalType>("savings");
  const [selectedIcon, setSelectedIcon] = useState("rent");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (isEditMode && goal) {
      setName(goal.name);
      setTargetAmount(String(goal.target));
      setCurrentAmount(String(goal.saved));
      setTargetDate(goal.targetDate ? goal.targetDate.slice(0, 10) : "");
      setSelectedType(goal.type as GoalType);
      setSelectedIcon(goal.icon ?? "home");
      return;
    }

    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("");
    setSelectedType("savings");
    setSelectedIcon("rent");
  }, [visible, isEditMode, goal]);

  async function handleSubmitGoal() {
    try {
      setIsSubmitting(true);

      const parsedTargetAmount = Number(targetAmount);
      const parsedCurrentAmount = currentAmount.trim()
        ? Number(currentAmount)
        : 0;

      if (!name.trim()) {
        throw new Error(t("goals.createModal.errors.nameRequired"));
      }

      if (!Number.isFinite(parsedTargetAmount) || parsedTargetAmount <= 0) {
        throw new Error(t("goals.createModal.errors.targetAmountInvalid"));
      }

      if (!Number.isFinite(parsedCurrentAmount) || parsedCurrentAmount < 0) {
        throw new Error(t("goals.createModal.errors.currentAmountInvalid"));
      }

      if (parsedCurrentAmount > parsedTargetAmount) {
        throw new Error(t("goals.createModal.errors.currentGreaterThanTarget"));
      }

      const normalizedTargetDate = targetDate.trim();

      if (
        normalizedTargetDate &&
        (!isCompleteIsoDate(normalizedTargetDate) ||
          !isTargetDateAllowed(normalizedTargetDate))
      ) {
        throw new Error(
          t("goals.createModal.errors.targetDateInvalid", {
            defaultValue:
              "Target date must be between today and the next 100 years.",
          }),
        );
      }

      const payload: CreateGoalPayload = {
        name: name.trim(),
        description: goal?.description ?? null,
        targetAmount: parsedTargetAmount,
        currentAmount: parsedCurrentAmount,
        currency: goal?.currency ?? "USD",
        targetDate: normalizedTargetDate || null,
        startDate: null,
        type: selectedType,
        icon: selectedIcon,
        color: goal?.color ?? "#00c896",
      };

      if (isEditMode && goal) {
        await onUpdate?.(goal.id, payload);
        return;
      }

      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, isDesktop && styles.overlayDesktop]}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.modal, isDesktop && styles.modalDesktop]}>
          {!isDesktop && <View style={styles.handle} />}

          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditMode
                ? t("goals.createModal.editTitle")
                : t("goals.createModal.createTitle")}
            </Text>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={20} color={BLACK} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.content,
              isDesktop && styles.contentDesktop,
            ]}
          >
            <View
              style={[
                styles.previewCard,
                isDesktop && styles.previewCardDesktop,
              ]}
            >
              <View style={styles.previewIcon}>
                <Icon
                  name={selectedIcon as never}
                  size={42}
                  color={TAB_GREEN}
                  strokeWidth={1.1}
                />
              </View>

              <View style={styles.previewInfo}>
                <Text style={styles.previewLabel}>
                  {isEditMode
                    ? t("goals.createModal.preview.editing")
                    : t("goals.createModal.preview.new")}
                </Text>

                <Text style={styles.previewTitle}>
                  {name.trim() || t("goals.createModal.placeholders.name")}
                </Text>

                <Text style={styles.previewMeta}>
                  {t("goals.createModal.preview.target", {
                    amount: targetAmount.trim()
                      ? `€${targetAmount}`
                      : t("goals.createModal.preview.defaultTargetAmount"),
                  })}
                </Text>
              </View>
            </View>

            <View style={isDesktop ? styles.desktopColumns : undefined}>
              <View style={isDesktop ? styles.desktopColumn : undefined}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>
                    {t("goals.createModal.fields.goalName")}
                  </Text>

                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder={t("goals.createModal.placeholders.name")}
                    placeholderTextColor="rgba(5, 46, 43, 0.45)"
                    style={styles.input}
                  />
                </View>

                <View style={styles.row}>
                  <View style={styles.halfField}>
                    <Text style={styles.label}>
                      {t("goals.createModal.fields.targetAmount")}
                    </Text>

                    <TextInput
                      value={targetAmount}
                      onChangeText={setTargetAmount}
                      placeholder={t(
                        "goals.createModal.placeholders.targetAmount",
                      )}
                      keyboardType="numeric"
                      placeholderTextColor="rgba(5, 46, 43, 0.45)"
                      style={styles.input}
                    />
                  </View>

                  <View style={styles.halfField}>
                    <Text style={styles.label}>
                      {t("goals.createModal.fields.currentSaved")}
                    </Text>

                    <TextInput
                      value={currentAmount}
                      onChangeText={setCurrentAmount}
                      placeholder={t(
                        "goals.createModal.placeholders.currentSaved",
                      )}
                      keyboardType="numeric"
                      placeholderTextColor="rgba(5, 46, 43, 0.45)"
                      style={styles.input}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <DateOfBirthInput
                    label={t("goals.createModal.fields.targetDate")}
                    icon="calendar-o"
                    placeholder={t("goals.createModal.placeholders.targetDate")}
                    value={formatIsoDateForDatePicker(targetDate)}
                    minimumDate={targetDateMinimumDate}
                    maximumDate={targetDateMaximumDate}
                    pickerDefaultDate={targetDateMinimumDate}
                    onChangeText={(value) => {
                      const nextTargetDate = formatDatePickerValueToIso(value);

                      if (
                        isCompleteIsoDate(nextTargetDate) &&
                        !isTargetDateAllowed(nextTargetDate)
                      ) {
                        return;
                      }

                      setTargetDate(nextTargetDate);
                    }}
                  />
                </View>
              </View>

              <View style={isDesktop ? styles.desktopColumn : undefined}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>
                    {t("goals.createModal.fields.goalType")}
                  </Text>

                  <View style={styles.chipsGrid}>
                    {goalTypes.map((type) => {
                      const isSelected = selectedType === type.value;

                      return (
                        <Pressable
                          key={type.value}
                          style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                          ]}
                          onPress={() =>
                            setSelectedType(type.value as GoalType)
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextSelected,
                            ]}
                          >
                            {t(`goals.details.goalTypes.${type.value}`)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>
                    {t("goals.createModal.fields.icon")}
                  </Text>

                  <View style={styles.iconsRow}>
                    {goalIcons.map((icon) => {
                      const isSelected = selectedIcon === icon.name;

                      return (
                        <Pressable
                          key={icon.name}
                          style={[
                            styles.iconOption,
                            isSelected && styles.iconOptionSelected,
                          ]}
                          onPress={() => setSelectedIcon(icon.name)}
                        >
                          <Icon
                            name={icon.name as never}
                            size={40}
                            color={TAB_GREEN}
                            strokeWidth={1}
                          />
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>

            <Pressable
              style={[
                styles.createButton,
                isDesktop && styles.createButtonDesktop,
                isSubmitting && styles.createButtonDisabled,
              ]}
              onPress={handleSubmitGoal}
              disabled={isSubmitting}
            >
              <Text style={styles.createButtonText}>
                {isSubmitting
                  ? isEditMode
                    ? t("goals.createModal.actions.saving")
                    : t("goals.createModal.actions.creating")
                  : isEditMode
                    ? t("goals.createModal.actions.saveChanges")
                    : t("goals.createModal.actions.createGoal")}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(223, 247, 239, 0.96)",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  overlayDesktop: {
    paddingHorizontal: 32,
    paddingVertical: 32,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },

  modal: {
    width: "100%",
    maxHeight: "94%",
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 18,
    overflow: "hidden",
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  modalDesktop: {
    maxWidth: 980,
    maxHeight: "88%",
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 24,
  },

  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: SOFT_GREEN,
    alignSelf: "center",
    marginBottom: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
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

  content: {
    paddingBottom: 4,
  },

  contentDesktop: {
    paddingBottom: 0,
  },

  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    padding: 16,
    marginBottom: 20,
  },

  previewCardDesktop: {
    padding: 20,
    marginBottom: 24,
  },

  desktopColumns: {
    flexDirection: "row",
    gap: 18,
    alignItems: "flex-start",
  },

  desktopColumn: {
    flex: 1,
    minWidth: 0,
  },

  previewIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  previewInfo: {
    flex: 1,
    minWidth: 0,
  },

  previewLabel: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: MUTED,
  },

  previewTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 4,
  },

  previewMeta: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: TAB_GREEN,
    marginTop: 5,
  },

  fieldGroup: {
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  halfField: {
    flex: 1,
    minWidth: 0,
  },

  label: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: BLACK,
    marginBottom: 10,
  },

  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER_GREEN,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: BLACK,
    shadowColor: "rgba(29, 100, 89, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  chipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  chip: {
    minWidth: 102,
    height: 38,
    borderRadius: 15,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER_GREEN,
  },

  chipSelected: {
    backgroundColor: BUTTON_GREEN,
    borderColor: BUTTON_GREEN,
  },

  chipText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  chipTextSelected: {
    color: BLACK,
    fontFamily: fonts.semibold,
  },

  iconsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  iconOption: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },

  iconOptionSelected: {
    backgroundColor: SOFT_GREEN,
  },

  createButton: {
    height: 50,
    borderRadius: 13,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  createButtonDesktop: {
    alignSelf: "flex-end",
    minWidth: 180,
    paddingHorizontal: 22,
  },

  createButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  createButtonDisabled: {
    opacity: 0.55,
  },
});