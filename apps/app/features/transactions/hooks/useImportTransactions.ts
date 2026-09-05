import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";

import { feedback } from "@/components/ui/feedback/feedback.service";
import { t } from "@/lib/i18n";
import { getAccountsFromResponse } from "../utils/createTransactionForm";
import {
  mapImportedTransactions,
  needsImportMapping,
  parseTransactionsCsv,
} from "../utils/importTransactions";
import { getAccounts } from "../services/accounts.service";
import { getCategoriesOverview } from "../services/categories.service";
import { importTransactions } from "../services/transactions.service";
import type {
  CsvImportMapping,
  ImportTransactionsPreview,
  PendingCsvImport,
} from "../types/importTransactions.types";

type UseImportTransactionsParams = {
  onImported: () => void | Promise<void>;
};

export function useImportTransactions({
  onImported,
}: UseImportTransactionsParams) {
  const [preview, setPreview] = useState<ImportTransactionsPreview | null>(
    null,
  );
  const [pendingImport, setPendingImport] = useState<PendingCsvImport | null>(
    null,
  );
  const [isImporting, setIsImporting] = useState(false);

  async function selectCsvFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values", "application/csv"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      const [csv, categoriesResponse, accountsResponse] = await Promise.all([
        readDocument(asset),
        getCategoriesOverview(),
        getAccounts(),
      ]);
      const rows = parseTransactionsCsv(csv);
      const categories = categoriesResponse.categories ?? [];
      const accounts = getAccountsFromResponse(accountsResponse) ?? [];

      if (needsImportMapping(rows)) {
        setPendingImport({ fileName: asset.name, rows, categories, accounts });
        return;
      }

      setPreview({
        fileName: asset.name,
        transactions: mapImportedTransactions(rows, categories, accounts),
      });
    } catch (error) {
      console.warn("[ImportTransactions] CSV selection error:", error);
      feedback.error(
        error instanceof Error
          ? error.message
          : t("transactions.import.feedback.readError"),
      );
    }
  }

  function applyImportMapping(mapping: CsvImportMapping) {
    if (!pendingImport) return;

    try {
      const transactions = mapImportedTransactions(
        pendingImport.rows,
        pendingImport.categories,
        pendingImport.accounts,
        mapping,
      );

      setPreview({ fileName: pendingImport.fileName, transactions });
      setPendingImport(null);
    } catch (error) {
      feedback.error(
        error instanceof Error
          ? error.message
          : t("transactions.import.feedback.readError"),
      );
    }
  }

  async function confirmImport() {
    if (!preview || isImporting) {
      return;
    }

    try {
      setIsImporting(true);
      const result = await importTransactions({
        transactions: preview.transactions.map(({ payload }) => payload),
      });

      feedback.success(
        t("transactions.import.feedback.success", {
          count: result.importedCount,
        }),
      );
      setPreview(null);
      await onImported();
    } catch (error) {
      console.warn("[ImportTransactions] submit error:", error);
      feedback.error(t("transactions.import.feedback.importError"));
    } finally {
      setIsImporting(false);
    }
  }

  return {
    preview,
    pendingImport,
    isImporting,
    selectCsvFile,
    applyImportMapping,
    confirmImport,
    closeMapping: () => setPendingImport(null),
    closePreview: () => {
      if (!isImporting) setPreview(null);
    },
  };
}

async function readDocument(asset: DocumentPicker.DocumentPickerAsset) {
  if (asset.file) {
    return asset.file.text();
  }

  return new File(asset.uri).text();
}
