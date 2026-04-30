import { useEffect, useMemo, useState } from "react";
import { getAccounts } from "../services/accounts.service";
import { getCategoriesOverview } from "../services/categories.service";
import { createTransaction } from "../services/transactions.service";

import {
  formatDateInput,
  getAccountsFromResponse,
  getDefaultTransactionNature,
  normalizeAmountInput,
  normalizeCurrency,
  parseTransactionDate,
} from "@/features/transactions/utils/createTransactionForm";

import {
  FrequencyType,
  TransactionNature,
  TransactionType,
  Category,
  Account
} from "@repo/shared-types";

type UseCreateTransactionFormParams = {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void | Promise<void>;
};

export function useCreateTransactionForm({
  visible,
  onClose,
  onCreated,
}: UseCreateTransactionFormParams) {
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

  const parsedAmount = normalizeAmountInput(amount);

  const canSave =
    amount.trim() &&
    parsedAmount > 0 &&
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
          getCategoriesOverview(),
          getAccounts(),
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

    setTransactionNature(getDefaultTransactionNature(type));
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

  function handleSelectAccount(account: Account) {
    setSelectedAccountId(account.id);

    const firstCurrency = account.currencies?.[0];

    if (firstCurrency) {
      setCurrency(firstCurrency);
    }
  }

  async function handleCreateTransaction() {
    if (!canSave) return;

    const parsedDate = parseTransactionDate(date);

    if (Number.isNaN(parsedAmount) || Number.isNaN(parsedDate.getTime())) {
      return;
    }

    try {
      setIsSaving(true);

      await createTransaction({
        amount: parsedAmount,
        currency: normalizeCurrency(currency),
        type,
        description: description.trim(),
        notes: notes.trim() || undefined,
        date: parsedDate.toISOString(),
        categoryId: selectedCategoryId,
        accountId: selectedAccountId,
        frequencyType,
        transactionNature,
      });

      resetForm();
      await onCreated?.();
      onClose();
    } catch (error) {
      console.warn("[CreateTransactionModal] create transaction error:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return {
    categories,
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
  };
}