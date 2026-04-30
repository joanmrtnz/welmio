import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { apiFetch } from "@/app/lib/api/client";

const WHITE = "#ffffff";
const BLACK = "#052e2b";
const LIGHT_GREEN = "#f1fff3";
const BUTTON_GREEN = "#1A9E6A";
const DARK_GREEN = "#059669";
const TAB_GREEN = "#14cfa1";
const LIGTH_GRAY = "rgba(0,0,0,0.1)";

type TransactionType = "income" | "expense";
type FrequencyType = "one_time" | "weekly" | "monthly" | "yearly";
type TransactionNature =
  | "fixed"
  | "variable"
  | "rent"
  | "subscription"
  | "salary"
  | "refund"
  | "other";

type Category = {
  id: string;
  name: string;
  color?: string | null;
  icon?: string | null;
  type: TransactionType;
};

type Account = {
  id: string;
  name: string;
  type: string;
  currencies?: string[];
};

type CategoriesOverviewResponse = {
  categories: Category[];
};

type AccountsResponse =
  | {
      accounts: Account[];
    }
  | Account[];

type CreateTransactionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void | Promise<void>;
};

const FREQUENCY_OPTIONS: { value: FrequencyType; label: string }[] = [
  { value: "one_time", label: "One time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const NATURE_OPTIONS: { value: TransactionNature; label: string }[] = [
  { value: "variable", label: "Variable" },
  { value: "fixed", label: "Fixed" },
  { value: "rent", label: "Rent" },
  { value: "subscription", label: "Subscription" },
  { value: "salary", label: "Salary" },
  { value: "refund", label: "Refund" },
  { value: "other", label: "Other" },
];


function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}

function getAccountsFromResponse(response: AccountsResponse) {
  return Array.isArray(response) ? response : response.accounts;
}

export function CreateTransactionModal({
  visible,
  onClose,
  onCreated,
}: CreateTransactionModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");

  const [frequencyType, setFrequencyType] =
    useState<FrequencyType>("one_time");
  const [transactionNature, setTransactionNature] =
    useState<TransactionNature>("variable");

  const [isSaving, setIsSaving] = useState(false);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => category.type === type);
  }, [categories, type]);

  const canSave =
    amount.trim() &&
    Number(amount.replace(",", ".")) > 0 &&
    description.trim() &&
    selectedCategoryId &&
    selectedAccountId &&
    date.trim() &&
    !isSaving;

    
    useEffect(() => {
    if (!visible) return;

    async function loadFormData() {
        try {
        const [categoriesResponse, accountsResponse] = await Promise.all([
            apiFetch<CategoriesOverviewResponse>("/categories/overview"),
            apiFetch<AccountsResponse>("/accounts"),
        ]);

        const nextCategories = categoriesResponse.categories ?? [];
        const nextAccounts = getAccountsFromResponse(accountsResponse) ?? [];

        setCategories(nextCategories);
        setAccounts(nextAccounts);

        const firstCategory = nextCategories.find(
            (category) => category.type === type,
        );

        const firstAccount = nextAccounts[0];

        setSelectedCategoryId(firstCategory?.id ?? "");
        setSelectedAccountId(firstAccount?.id ?? "");

        if (firstAccount?.currencies?.[0]) {
            setCurrency(firstAccount.currencies[0]);
        }

        } catch (error) {
        console.warn("[CreateTransactionModal] form data error:", error);
        }
    }

    loadFormData();
    }, [visible, type]);

  useEffect(() => {
    const categoryExistsInCurrentType = filteredCategories.some(
      (category) => category.id === selectedCategoryId,
    );

    if (!categoryExistsInCurrentType) {
      setSelectedCategoryId(filteredCategories[0]?.id ?? "");
    }

    if (type === "income") {
      setTransactionNature("salary");
    } else {
      setTransactionNature("variable");
    }
  }, [type, filteredCategories, selectedCategoryId]);

  function resetForm() {
    setType("expense");
    setAmount("");
    setCurrency("EUR");
    setDate(formatDateInput(new Date()));
    setDescription("");
    setNotes("");
    setSelectedCategoryId("");
    setSelectedAccountId("");
    setFrequencyType("one_time");
    setTransactionNature("variable");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function createTransaction() {
    if (!canSave) return;

    const parsedAmount = Number(amount.replace(",", "."));
    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (Number.isNaN(parsedAmount) || Number.isNaN(parsedDate.getTime())) {
      return;
    }

    try {
      setIsSaving(true);

      await apiFetch("/transactions", {
        method: "POST",
        body: JSON.stringify({
          amount: parsedAmount,
          currency: currency.trim().toUpperCase(),
          type,
          description: description.trim(),
          notes: notes.trim() || undefined,
          date: parsedDate.toISOString(),
          categoryId: selectedCategoryId,
          accountId: selectedAccountId,
          frequencyType,
          transactionNature,
        }),
      });

      resetForm();
      await onCreated?.();
      onClose();
    } catch (error) {
      console.warn(error);
    } finally {
      setIsSaving(false);
    }
  }

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
                    onPress={() => {
                      setSelectedAccountId(account.id);

                      const firstCurrency = account.currencies?.[0];

                      if (firstCurrency) {
                        setCurrency(firstCurrency);
                      }
                    }}
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
                onPress={createTransaction}
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modalCard: {
    width: "100%",
    maxHeight: "86%",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LIGTH_GRAY,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    width: "100%",
    padding: 2,
  },

  content: {
    paddingBottom: 4,
  },

  sectionLabel: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: BLACK,
    marginBottom: 8,
  },

  input: {
    height: 44,
    borderRadius: 16,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  amountRow: {
    flexDirection: "row",
    gap: 10,
  },

  amountInput: {
    flex: 1,
  },

  currencyInput: {
    width: 82,
    textAlign: "center",
  },

  typeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  typeButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  typeButtonSelected: {
    backgroundColor: TAB_GREEN,
    borderColor: TAB_GREEN,
  },

  typeButtonText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  typeButtonTextSelected: {
    color: WHITE,
  },

  selectorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },

  selectorOption: {
    width: "30%",
    height: 68,
    borderRadius: 18,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  selectorOptionSelected: {
    backgroundColor: BUTTON_GREEN,
    borderColor: BUTTON_GREEN,
  },

  selectorOptionText: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: BLACK,
    maxWidth: "90%",
  },

  selectorOptionTextSelected: {
    color: WHITE,
    fontFamily: fonts.bold,
  },

  optionColumn: {
    gap: 10,
    marginBottom: 16,
  },

  accountOption: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  accountOptionSelected: {
    backgroundColor: DARK_GREEN,
    borderColor: DARK_GREEN,
  },

  accountName: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  accountNameSelected: {
    color: WHITE,
  },

  accountMeta: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: BLACK,
    marginTop: 2,
    textTransform: "capitalize",
  },

  accountMetaSelected: {
    color: WHITE,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  chip: {
    height: 34,
    borderRadius: 14,
    backgroundColor: WHITE,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  chipSelected: {
    backgroundColor: TAB_GREEN,
    borderColor: TAB_GREEN,
  },

  chipText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  chipTextSelected: {
    color: WHITE,
  },

  textArea: {
    minHeight: 96,
    borderRadius: 16,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },

  clearButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: LIGTH_GRAY,
    alignItems: "center",
    justifyContent: "center",
  },

  clearButtonText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  applyButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: TAB_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonDisabled: {
    opacity: 0.5,
  },

  applyButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: WHITE,
  },
});