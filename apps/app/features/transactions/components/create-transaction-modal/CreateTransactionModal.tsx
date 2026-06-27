import { useEffect } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { Icon } from "@/components/icons/Icon";
import { DateInput } from "@/components/ui/date-input/dateInput";
import { t } from "@/lib/i18n";

import { useCreateTransactionForm } from "@/features/transactions/hooks/useCreateTransactionForm";
import {
  FREQUENCY_OPTIONS,
  NATURE_OPTIONS,
} from "@/features/transactions/constants/transactionOptions";

import {
  createTransactionModalColors,
  styles,
} from "@/features/transactions/components/create-transaction-modal/createTransactionModal.styles";
import { TransactionOverviewItem } from "@repo/shared-types";

type CreateTransactionModalProps = {
  visible: boolean;
  transactionToEdit?: TransactionOverviewItem | null;
  onClose: () => void;
  onCreated?: () => void | Promise<void>;
  initialValues?: {
    type?: "income" | "expense";
    goalId?: string;
    description?: string;
    notes?: string;
  } | null;
  lockType?: boolean;
};

const MAX_TRANSACTION_AMOUNT = 9999999999.99;
const DECIMAL_SCALE = 2;
const MAX_TRANSACTION_DESCRIPTION_LENGTH = 120;
const MAX_TRANSACTION_NOTES_LENGTH = 500;

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

function normalizeTranslationKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function translateOptionLabel(
  group: "natureOptions" | "frequencyOptions" | "accountTypes",
  value: string,
  fallback: string,
) {
  const key = normalizeTranslationKey(value || fallback);

  return t(`transactions.form.${group}.${key}`, {
    defaultValue: fallback,
  });
}

function getAmountValidationMessage(value: string) {
  const normalizedValue = value.trim().replace(",", ".");

  if (!normalizedValue) {
    return null;
  }

  const decimalPart = normalizedValue.includes(".")
    ? normalizedValue.split(".")[1] ?? ""
    : "";

  if (decimalPart.length > DECIMAL_SCALE) {
    return t("transactions.form.validation.amountMaxDecimals", {
      count: DECIMAL_SCALE,
    });
  }

  const numericValue = Number(normalizedValue);

  if (!Number.isFinite(numericValue)) {
    return t("transactions.form.validation.amountInvalid");
  }

  if (numericValue <= 0) {
    return t("transactions.form.validation.amountGreaterThanZero");
  }

  if (numericValue > MAX_TRANSACTION_AMOUNT) {
    return t("transactions.form.validation.amountMax", {
      amount: MAX_TRANSACTION_AMOUNT,
    });
  }

  return null;
}

export function CreateTransactionModal({
  visible,
  transactionToEdit,
  onClose,
  onCreated,
  initialValues,
  lockType = false,
}: CreateTransactionModalProps) {
  const {
    accounts,
    filteredCategories,

    type,
    setType,

    selectedGoalId,
    setSelectedGoalId,

    amount,
    setAmount,

    currency,
    setCurrency,

    date,
    setDate,

    description,
    setDescription,

    notes,
    setNotes,

    selectedCategoryId,
    setSelectedCategoryId,

    selectedAccountId,

    frequencyType,
    setFrequencyType,

    transactionNature,
    setTransactionNature,

    isSaving,
    canSave,

    handleClose,
    handleSelectAccount,
    handleSubmitTransaction,
  } = useCreateTransactionForm({
    visible,
    transactionToEdit,
    onClose,
    onCreated,
    initialValues,
    lockType,
  });

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const { BLACK, TAB_GREEN } = createTransactionModalColors;

  const amountValidationMessage = getAmountValidationMessage(amount);
  const isDescriptionTooLong =
    description.trim().length > MAX_TRANSACTION_DESCRIPTION_LENGTH;
  const isNotesTooLong = notes.trim().length > MAX_TRANSACTION_NOTES_LENGTH;

  const hasValidationError = Boolean(amountValidationMessage)
    || isDescriptionTooLong
    || isNotesTooLong;

  const canSubmitTransaction = canSave && !hasValidationError && !isSaving;

  async function handleValidatedSubmitTransaction() {
    if (!canSubmitTransaction) {
      return;
    }

    await handleSubmitTransaction();
  }

  useEffect(() => {
    if (!visible) return;

    if (!initialValues) return;

    if (initialValues.type) {
      setType(initialValues.type);
    }

    if (initialValues.description) {
      setDescription(initialValues.description);
    }

    if (initialValues.notes) {
      setNotes(initialValues.notes);
    }

    if (initialValues.goalId) {
      setSelectedGoalId(initialValues.goalId);
    }
  }, [visible, initialValues]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={[styles.overlay, isDesktop && styles.overlayDesktop]}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {transactionToEdit
                ? t("transactions.form.editTitle")
                : t("transactions.form.newTitle")}
            </Text>

            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={15} color={BLACK} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.content,
              isDesktop && styles.contentDesktop,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[isDesktop && styles.desktopColumns]}>
              <View style={[isDesktop && styles.desktopColumn]}>
                <Text style={styles.sectionLabel}>
                  {t("transactions.form.type")}
                </Text>

                {!lockType ? (
                  <View
                    style={[styles.typeRow, isDesktop && styles.typeRowDesktop]}
                  >
                    <Pressable
                      style={[
                        styles.typeButton,
                        type === "income" && styles.typeButtonSelected,
                      ]}
                      onPress={() => setType("income")}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          type === "income" && styles.typeButtonTextSelected,
                        ]}
                      >
                        {t("transactions.types.income")}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.typeButton,
                        type === "expense" && styles.typeButtonSelected,
                      ]}
                      onPress={() => setType("expense")}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          type === "expense" && styles.typeButtonTextSelected,
                        ]}
                      >
                        {t("transactions.types.expense")}
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View
                    style={[styles.typeRow, isDesktop && styles.typeRowDesktop]}
                  >
                    <View style={[styles.typeButton, styles.typeButtonSelected]}>
                      <Text style={styles.typeButtonTextSelected}>
                        {t("transactions.form.incomeContribution")}
                      </Text>
                    </View>
                  </View>
                )}

                <DateInput
                  label={t("transactions.form.date")}
                  icon="calendar-o"
                  placeholder={t("transactions.form.datePlaceholder")}
                  value={formatIsoDateForDatePicker(date)}
                  onChangeText={(value) => {
                    setDate(formatDatePickerValueToIso(value));
                  }}
                />

                <Text style={styles.sectionLabel}>
                  {t("transactions.form.amount")}
                </Text>

                <View style={styles.amountRow}>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    placeholder={t("transactions.form.amountPlaceholder")}
                    placeholderTextColor="rgba(5, 46, 43, 0.45)"
                    keyboardType="decimal-pad"
                    style={[styles.input, styles.amountInput]}
                  />

                  <TextInput
                    value={currency || "EUR"}
                    editable={false}
                    pointerEvents="none"
                    style={[styles.input, styles.currencyInput]}
                  />

                  {/* TODO: allow diferent concurrency system
                  <TextInput
                    value={currency}
                    onChangeText={setCurrency}
                    maxLength={3}
                    placeholder="EUR"
                    editable={false}
                    placeholderTextColor="rgba(5, 46, 43, 0.45)"
                    autoCapitalize="characters"
                    style={[styles.input, styles.currencyInput]}
                  /> */}
                </View>

                {amountValidationMessage && (
                  <Text style={styles.validationWarningLabel}>
                    {amountValidationMessage}
                  </Text>
                )}

                <Text style={styles.sectionLabel}>
                  {t("transactions.form.description")}
                </Text>

                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder={t("transactions.form.descriptionPlaceholder")}
                  placeholderTextColor="rgba(5, 46, 43, 0.45)"
                  style={styles.input}
                />

                {isDescriptionTooLong && (
                  <Text style={styles.validationWarningLabel}>
                    {t("transactions.form.validation.descriptionMaxLength", {
                      count: MAX_TRANSACTION_DESCRIPTION_LENGTH,
                    })}
                  </Text>
                )}

                <Text style={styles.sectionLabel}>
                  {t("transactions.form.category")}
                </Text>

                <View
                  style={[
                    styles.selectorGrid,
                    isDesktop && styles.selectorGridDesktop,
                  ]}
                >
                  {filteredCategories.map((category) => {
                    const isSelected = selectedCategoryId === category.id;

                    return (
                      <Pressable
                        key={category.id}
                        style={[
                          styles.selectorOption,
                          isDesktop && styles.selectorOptionDesktop,
                          isSelected && styles.selectorOptionSelected,
                        ]}
                        onPress={() => setSelectedCategoryId(category.id)}
                      >
                        <Icon
                          name={(category.icon ?? "plus") as any}
                          size={40}
                          strokeWidth={1}
                          color={TAB_GREEN}
                        />

                        <Text
                          numberOfLines={1}
                          style={[
                            styles.selectorOptionText,
                            isSelected && styles.selectorOptionTextSelected,
                          ]}
                        >
                          {category.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={[isDesktop && styles.desktopColumn]}>
                <Text style={styles.sectionLabel}>
                  {t("transactions.form.account")}
                </Text>

                <View
                  style={[
                    styles.optionColumn,
                    isDesktop && styles.optionColumnDesktop,
                  ]}
                >
                  {accounts.map((account) => {
                    const isSelected = selectedAccountId === account.id;

                    return (
                      <Pressable
                        key={account.id}
                        style={[
                          styles.accountOption,
                          isSelected && styles.accountOptionSelected,
                        ]}
                        onPress={() => handleSelectAccount(account)}
                      >
                        <View>
                          <Text
                            style={[
                              styles.accountName,
                              isSelected && styles.accountNameSelected,
                            ]}
                          >
                            {account.name}
                          </Text>

                          <Text
                            style={[
                              styles.accountMeta,
                              isSelected && styles.accountMetaSelected,
                            ]}
                          >
                            {translateOptionLabel(
                              "accountTypes",
                              account.type,
                              account.type,
                            )}
                          </Text>
                        </View>

                        {isSelected ? (
                          <Icon name="check" size={20} color={TAB_GREEN} />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={styles.sectionLabel}>
                  {t("transactions.form.nature")}
                </Text>

                <View
                  style={[styles.chipsRow, isDesktop && styles.chipsRowDesktop]}
                >
                  {NATURE_OPTIONS.map((item) => {
                    const isSelected = transactionNature === item.value;

                    return (
                      <Pressable
                        key={item.value}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => setTransactionNature(item.value)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextSelected,
                          ]}
                        >
                          {translateOptionLabel(
                            "natureOptions",
                            item.value,
                            item.label,
                          )}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={styles.sectionLabel}>
                  {t("transactions.form.frequency")}
                </Text>

                <View
                  style={[styles.chipsRow, isDesktop && styles.chipsRowDesktop]}
                >
                  {FREQUENCY_OPTIONS.map((item) => {
                    const isSelected = frequencyType === item.value;

                    return (
                      <Pressable
                        key={item.value}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => setFrequencyType(item.value)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextSelected,
                          ]}
                        >
                          {translateOptionLabel(
                            "frequencyOptions",
                            item.value,
                            item.label,
                          )}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={styles.sectionLabel}>
                  {t("transactions.form.notes")}
                </Text>

                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder={t("transactions.form.notesPlaceholder")}
                  placeholderTextColor="rgba(5, 46, 43, 0.45)"
                  multiline
                  textAlignVertical="top"
                  style={styles.textArea}
                />

                {isNotesTooLong && (
                  <Text style={styles.validationWarningLabel}>
                    {t("transactions.form.validation.notesMaxLength", {
                      count: MAX_TRANSACTION_NOTES_LENGTH,
                    })}
                  </Text>
                )}

                <View style={styles.actions}>
                  <Pressable style={styles.clearButton} onPress={handleClose}>
                    <Text style={styles.clearButtonText}>
                      {t("transactions.form.cancel")}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.applyButton,
                      !canSubmitTransaction && styles.applyButtonDisabled,
                    ]}
                    onPress={handleValidatedSubmitTransaction}
                    disabled={!canSubmitTransaction}
                  >
                    <Text style={styles.applyButtonText}>
                      {isSaving
                        ? transactionToEdit
                          ? t("transactions.form.updating")
                          : t("transactions.form.saving")
                        : transactionToEdit
                          ? t("transactions.form.update")
                          : t("transactions.form.save")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}