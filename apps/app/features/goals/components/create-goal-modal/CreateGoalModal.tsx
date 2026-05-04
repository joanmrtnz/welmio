import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState, useEffect } from "react";
import { Icon } from "@/components/icons/Icon";
import { fonts } from "@/theme/fonts";
import { CreateGoalPayload, GoalOverviewItem, GoalType } from "@repo/shared-types";

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const BUTTON_GREEN = "#1A9E6A";
const DIVIDER_GREEN = "#00d09e";
const LIGTH_GRAY = "rgba(0,0,0,0.1)";


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
  { label: "Savings", value: "savings" },
  { label: "Emergency", value: "emergency_fund" },
  { label: "Purchase", value: "purchase" },
  { label: "Investment", value: "investment" },
];

const goalIcons = [
  { name: "home", label: "Home" },
  { name: "money", label: "Money" },
  { name: "income", label: "Income" },
  { name: "calendar", label: "Plan" },
];

export function CreateGoalModal({
  visible,
  mode = "create",
  goal = null,
  onClose,
  onSubmit,
  onUpdate,
}: CreateGoalModalProps) {

  const isEditMode = mode === "edit";

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
    setSelectedIcon("home");
  }, [visible, isEditMode, goal]);

  async function handleSubmitGoal() {
    try {
      setIsSubmitting(true);

      const parsedTargetAmount = Number(targetAmount);
      const parsedCurrentAmount = currentAmount.trim()
        ? Number(currentAmount)
        : 0;

      if (!name.trim()) {
        throw new Error("Goal name is required.");
      }

      if (!Number.isFinite(parsedTargetAmount) || parsedTargetAmount <= 0) {
        throw new Error("Target amount must be greater than 0.");
      }

      if (!Number.isFinite(parsedCurrentAmount) || parsedCurrentAmount < 0) {
        throw new Error("Current amount must be 0 or greater.");
      }

      if (parsedCurrentAmount > parsedTargetAmount) {
        throw new Error("Current amount cannot be greater than target amount.");
      }

      const payload: CreateGoalPayload = {
        name: name.trim(),
        description: goal?.description ?? null,
        targetAmount: parsedTargetAmount,
        currentAmount: parsedCurrentAmount,
        currency: goal?.currency ?? "USD",
        targetDate: targetDate.trim() || null,
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
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modal}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>{isEditMode ? "Edit Goal" : "Create Goal"}</Text>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={20} color={BLACK} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.previewCard}>
              <View style={styles.previewIcon}>
                <Icon
                  name={selectedIcon as never}
                  size={42}
                  color={WHITE}
                  strokeWidth={1.1}
                />
              </View>

              <View style={styles.previewInfo}>
                <Text style={styles.previewLabel}>
                  {isEditMode ? "Editing goal" : "New goal"}
                </Text>
                <Text style={styles.previewTitle}>
                  {name.trim() || "House Deposit"}
                </Text>
                <Text style={styles.previewMeta}>
                  Target · {targetAmount.trim() ? `$${targetAmount}` : "$30,000"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Goal name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="House Deposit"
                placeholderTextColor="rgba(5, 46, 43, 0.45)"
                style={styles.input}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Target amount</Text>
                <TextInput
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                  placeholder="30000"
                  keyboardType="numeric"
                  placeholderTextColor="rgba(5, 46, 43, 0.45)"
                  style={styles.input}
                />
              </View>

              <View style={styles.halfField}>
                <Text style={styles.label}>Current saved</Text>
                <TextInput
                  value={currentAmount}
                  onChangeText={setCurrentAmount}
                  placeholder="9000"
                  keyboardType="numeric"
                  placeholderTextColor="rgba(5, 46, 43, 0.45)"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Target date</Text>
              <TextInput
                value={targetDate}
                onChangeText={setTargetDate}
                placeholder="2027-12-31"
                placeholderTextColor="rgba(5, 46, 43, 0.45)"
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Goal type</Text>

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
                      onPress={() => setSelectedType(type.value as GoalType)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Icon</Text>

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
                        color={isSelected ? WHITE : BUTTON_GREEN}
                        strokeWidth={1}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>

          <Pressable
            style={[styles.createButton, isSubmitting && styles.createButtonDisabled]}
            onPress={handleSubmitGoal}
            disabled={isSubmitting}
          >
           <Text style={styles.createButtonText}>
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                  ? "Save changes"
                  : "Create goal"}
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
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.32)",
  },

  modal: {
    maxHeight: "88%",
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    paddingTop: 12,
    overflow: "hidden",
  },

  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: DIVIDER_GREEN,
    alignSelf: "center",
    marginBottom: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 28,
    paddingBottom: 34,
  },

  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN,
    borderRadius: 28,
    padding: 18,
    marginBottom: 22,
  },

  previewIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  previewInfo: {
    flex: 1,
  },

  previewLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
    opacity: 0.75,
  },

  previewTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
    marginTop: 4,
  },

  previewMeta: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: BLACK,
    marginTop: 5,
  },

  fieldGroup: {
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  halfField: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderRadius: 18,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  chipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: "transparent",
  },

  chipSelected: {
    backgroundColor: GREEN,
    borderColor: BUTTON_GREEN,
  },

  chipText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  chipTextSelected: {
    fontFamily: fonts.bold,
  },

  iconsRow: {
    flexDirection: "row",
    gap: 12,
  },

  iconOption: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: LIGTH_GRAY,
  },

  iconOptionSelected: {
    backgroundColor: BUTTON_GREEN,
    borderColor: DIVIDER_GREEN,
  },

  createButton: {
    height: 56,
    borderRadius: 22,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  createButtonText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  createButtonDisabled: {
    opacity: 0.6,
  },
});