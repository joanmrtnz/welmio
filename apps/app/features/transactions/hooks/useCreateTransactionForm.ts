import { useEffect, useMemo, useState } from "react";
import { getAccounts } from "../services/accounts.service";
import { getCategoriesOverview } from "../services/categories.service";
import { createTransaction, updateTransaction } from "../services/transactions.service";

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
  Account,
  TransactionOverviewItem
} from "@repo/shared-types";
import { feedback } from "@/components/ui/feedback/feedback.service";

type UseCreateTransactionFormParams = {
  visible: boolean;
  transactionToEdit?: TransactionOverviewItem | null;
  onClose: () => void;
  onCreated?: () => void | Promise<void>;
};

export function useCreateTransactionForm({
  visible,
  transactionToEdit,
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
  
    function fillFormFromTransaction(transaction: TransactionOverviewItem) {
        setType(transaction.type);
        setAmount(String(transaction.amount));
        setCurrency(transaction.currency);
        setDate(formatDateInput(new Date(transaction.date)));
        setDescription(transaction.description);
        setNotes(transaction.notes ?? "");
        setSelectedCategoryId(transaction.category.id);
        setSelectedAccountId(transaction.account.id);
        setFrequencyType(transaction.frequencyType);
        setTransactionNature(transaction.transactionNature);
    }

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

        if (transactionToEdit) {
          fillFormFromTransaction(transactionToEdit);
          return;
        }

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
  }, [visible, transactionToEdit]);

  useEffect(() => {
    if (transactionToEdit) return;

    const categoryExistsInCurrentType = filteredCategories.some(
      (category) => category.id === selectedCategoryId,
    );

    if (!categoryExistsInCurrentType) {
      setSelectedCategoryId(filteredCategories[0]?.id ?? "");
    }

    setTransactionNature(getDefaultTransactionNature(type));
  }, [type, filteredCategories, selectedCategoryId, transactionToEdit]);

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

  async function handleSubmitTransaction() {
    if (!canSave) return;

    const parsedDate = parseTransactionDate(date);

    if (Number.isNaN(parsedAmount) || Number.isNaN(parsedDate.getTime())) {
      return;
    }

    const payload = {
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
    };

    try {
      setIsSaving(true);

      if (transactionToEdit) {
        await updateTransaction(transactionToEdit.id, payload);
        feedback.success("Transaction updated successfully");
      } else {
        await createTransaction(payload);
        feedback.success("Transaction created successfully");
      }

      resetForm();
      await onCreated?.();
      onClose();
    } catch (error) {
      console.warn("[CreateTransactionModal] submit transaction error:", error);
      feedback.error("Error submitting the transaction");
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
    handleSubmitTransaction,
  };
}