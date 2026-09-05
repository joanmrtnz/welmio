import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Icon } from "@/components/icons/Icon";
import { t } from "@/lib/i18n";
import type {
  CsvImportMapping,
  PendingCsvImport,
} from "../../types/importTransactions.types";
import { styles } from "./importTransactionsModal.styles";

type ImportTransactionsMappingContentProps = {
  pendingImport: PendingCsvImport | null;
  onClose: () => void;
  onContinue: (mapping: CsvImportMapping) => void;
};

export function ImportTransactionsMappingContent({
  pendingImport,
  onClose,
  onContinue,
}: ImportTransactionsMappingContentProps) {
  const [accountId, setAccountId] = useState("");
  const [incomeCategoryId, setIncomeCategoryId] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");

  const incomeCategories = useMemo(
    () =>
      pendingImport?.categories.filter(({ type }) => type === "income") ?? [],
    [pendingImport],
  );
  const expenseCategories = useMemo(
    () =>
      pendingImport?.categories.filter(({ type }) => type === "expense") ?? [],
    [pendingImport],
  );
  const hasIncome = pendingImport?.rows.some(({ type }) => type === "income");
  const hasExpense = pendingImport?.rows.some(({ type }) => type === "expense");

  useEffect(() => {
    setAccountId(pendingImport?.accounts[0]?.id ?? "");
    setIncomeCategoryId(incomeCategories[0]?.id ?? "");
    setExpenseCategoryId(expenseCategories[0]?.id ?? "");
  }, [pendingImport, incomeCategories, expenseCategories]);

  const canContinue =
    Boolean(accountId) &&
    (!hasIncome || Boolean(incomeCategoryId)) &&
    (!hasExpense || Boolean(expenseCategoryId));

  return (
    <View style={[styles.modalCard, styles.mappingCard]}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>
            {t("transactions.import.mapping.title")}
          </Text>
          <Text style={styles.fileName} numberOfLines={1}>
            {pendingImport?.fileName}
          </Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={15} />
        </Pressable>
      </View>

      <Text style={styles.summary}>
        {t("transactions.import.mapping.description")}
      </Text>

      <ScrollView
        style={styles.mappingScroll}
        contentContainerStyle={styles.mappingContent}
      >
        <MappingSection
          label={t("transactions.import.mapping.account")}
          emptyLabel={t("transactions.import.mapping.noAccounts")}
          options={
            pendingImport?.accounts.map(({ id, name }) => ({ id, name })) ?? []
          }
          selectedId={accountId}
          onSelect={setAccountId}
        />

        {hasExpense ? (
          <MappingSection
            label={t("transactions.import.mapping.expenseCategory")}
            emptyLabel={t("transactions.import.mapping.noExpenseCategories")}
            options={expenseCategories}
            selectedId={expenseCategoryId}
            onSelect={setExpenseCategoryId}
          />
        ) : null}

        {hasIncome ? (
          <MappingSection
            label={t("transactions.import.mapping.incomeCategory")}
            emptyLabel={t("transactions.import.mapping.noIncomeCategories")}
            options={incomeCategories}
            selectedId={incomeCategoryId}
            onSelect={setIncomeCategoryId}
          />
        ) : null}
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}
        >
          <Text style={styles.cancelText}>{t("common.cancel")}</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            styles.importButton,
            !canContinue && styles.buttonDisabled,
          ]}
          disabled={!canContinue}
          onPress={() =>
            onContinue({ accountId, incomeCategoryId, expenseCategoryId })
          }
        >
          <Text style={styles.importText}>
            {t("transactions.import.mapping.review")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type MappingSectionProps = {
  label: string;
  emptyLabel: string;
  options: { id: string; name: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
};

function MappingSection({
  label,
  emptyLabel,
  options,
  selectedId,
  onSelect,
}: MappingSectionProps) {
  return (
    <View style={styles.mappingSection}>
      <Text style={styles.mappingLabel}>{label}</Text>
      {options.length > 0 ? (
        <View style={styles.mappingOptions}>
          {options.map((option) => {
            const isSelected = selectedId === option.id;

            return (
              <Pressable
                key={option.id}
                style={[
                  styles.mappingOption,
                  isSelected && styles.mappingOptionSelected,
                ]}
                onPress={() => onSelect(option.id)}
              >
                <Text
                  style={[
                    styles.mappingOptionText,
                    isSelected && styles.mappingOptionTextSelected,
                  ]}
                >
                  {option.name}
                </Text>
                {isSelected ? <Icon name="check" size={18} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={styles.mappingEmpty}>{emptyLabel}</Text>
      )}
    </View>
  );
}
