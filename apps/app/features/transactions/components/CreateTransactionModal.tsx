import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
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
} from "@/features/transactions/components/createTransactionModal.styles";

type CreateTransactionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void | Promise<void>;
};

export function CreateTransactionModal({
  visible,
  onClose,
  onCreated,
}: CreateTransactionModalProps) {
  const {
    accounts,
    filteredCategories,

    type,
    setType,

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
    handleCreateTransaction,
  } = useCreateTransactionForm({
    visible,
    onClose,
    onCreated,
  });

  const { BLACK, WHITE } = createTransactionModalColors;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>New Transaction</Text>

            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={15} color={BLACK} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionLabel}>Type</Text>

            <View style={styles.typeRow}>
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

            <View style={styles.selectorGrid}>
              {filteredCategories.map((category) => {
                const isSelected = selectedCategoryId === category.id;

                return (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.selectorOption,
                      isSelected && styles.selectorOptionSelected,
                    ]}
                    onPress={() => setSelectedCategoryId(category.id)}
                  >
                    <Icon
                      name={(category.icon ?? "plus") as any}
                      size={22}
                      color={isSelected ? WHITE : BLACK}
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

            <Text style={styles.sectionLabel}>Account</Text>

            <View style={styles.optionColumn}>
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
                      <Icon name="check" size={20} color={WHITE} />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>Nature</Text>

            <View style={styles.chipsRow}>
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

            <View style={styles.chipsRow}>
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
                onPress={handleCreateTransaction}
              >
                <Text style={styles.applyButtonText}>
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}