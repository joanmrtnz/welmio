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
import { useEffect } from "react";

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
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {transactionToEdit ? "Edit Transaction" : "New Transaction"}
            </Text>

            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={15} color={BLACK} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.content, isDesktop && styles.contentDesktop]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[isDesktop && styles.desktopColumns]}>
              <View style={[isDesktop && styles.desktopColumn]}>
            <Text style={styles.sectionLabel}>Type</Text>

            {!lockType ? (
              <View style={[styles.typeRow, isDesktop && styles.typeRowDesktop]}>
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
                    Income
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
                    Expense
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={[styles.typeRow, isDesktop && styles.typeRowDesktop]}>
                <View style={[styles.typeButton, styles.typeButtonSelected]}>
                  <Text style={styles.typeButtonTextSelected}>
                    Income contribution
                  </Text>
                </View>
              </View>
            )}

            <Text style={styles.sectionLabel}>Date</Text>

            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="rgba(5, 46, 43, 0.45)"
              style={styles.input}
            />

            <Text style={styles.sectionLabel}>Amount</Text>

            <View style={styles.amountRow}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="30.00"
                placeholderTextColor="rgba(5, 46, 43, 0.45)"
                keyboardType="decimal-pad"
                style={[styles.input, styles.amountInput]}
              />

              <TextInput
                value={currency}
                onChangeText={setCurrency}
                maxLength={3}
                placeholder="EUR"
                placeholderTextColor="rgba(5, 46, 43, 0.45)"
                autoCapitalize="characters"
                style={[styles.input, styles.currencyInput]}
              />
            </View>

            <Text style={styles.sectionLabel}>Description</Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Cinema"
              placeholderTextColor="rgba(5, 46, 43, 0.45)"
              style={styles.input}
            />

            <Text style={styles.sectionLabel}>Category</Text>

            <View style={[styles.selectorGrid, isDesktop && styles.selectorGridDesktop]}>
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
            <Text style={styles.sectionLabel}>Account</Text>

            <View style={[styles.optionColumn, isDesktop && styles.optionColumnDesktop]}>
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
                        {account.type}
                      </Text>
                    </View>

                    {isSelected ? (
                      <Icon name="check" size={20} color={TAB_GREEN} />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>Nature</Text>

            <View style={[styles.chipsRow, isDesktop && styles.chipsRowDesktop]}>
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
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>Frequency</Text>

            <View style={[styles.chipsRow, isDesktop && styles.chipsRowDesktop]}>
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
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>Notes</Text>

            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter message"
              placeholderTextColor="rgba(5, 46, 43, 0.45)"
              multiline
              textAlignVertical="top"
              style={styles.textArea}
            />

            <View style={styles.actions}>
              <Pressable style={styles.clearButton} onPress={handleClose}>
                <Text style={styles.clearButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.applyButton,
                  !canSave && styles.applyButtonDisabled,
                ]}
                onPress={handleSubmitTransaction}
              >
                <Text style={styles.applyButtonText}>
                  {isSaving
                    ? transactionToEdit
                      ? "Updating..."
                      : "Saving..."
                    : transactionToEdit
                      ? "Update"
                      : "Save"}
                </Text>
              </Pressable>
            </View>
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
