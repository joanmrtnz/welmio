import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Icon } from "@/components/icons/Icon";
import { t } from "@/lib/i18n";
import { TransactionRow } from "../transaction-row/TransactionRow";
import { styles } from "./importTransactionsModal.styles";
import { ImportTransactionsMappingContent } from "./ImportTransactionsMappingModal";
import type {
  CsvImportMapping,
  ImportTransactionsPreview,
  PendingCsvImport,
} from "../../types/importTransactions.types";

type ImportTransactionsModalProps = {
  preview: ImportTransactionsPreview | null;
  pendingImport: PendingCsvImport | null;
  isImporting: boolean;
  onClose: () => void;
  onCloseMapping: () => void;
  onApplyMapping: (mapping: CsvImportMapping) => void;
  onImport: () => void;
};

export function ImportTransactionsModal({
  preview,
  pendingImport,
  isImporting,
  onClose,
  onCloseMapping,
  onApplyMapping,
  onImport,
}: ImportTransactionsModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <Modal
      visible={Boolean(preview || pendingImport)}
      transparent
      animationType="fade"
      onRequestClose={
        isImporting ? undefined : pendingImport ? onCloseMapping : onClose
      }
    >
      <View
        style={[
          pendingImport ? styles.overlayCentered : styles.overlay,
          !pendingImport && isDesktop && styles.overlayDesktop,
        ]}
      >
        <Pressable
          style={styles.backdrop}
          onPress={pendingImport ? onCloseMapping : onClose}
          disabled={isImporting}
        />

        {pendingImport ? (
          <ImportTransactionsMappingContent
            pendingImport={pendingImport}
            onClose={onCloseMapping}
            onContinue={onApplyMapping}
          />
        ) : (
          <View
            style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}
          >
            <View style={styles.header}>
              <View style={styles.titleBlock}>
                <Text style={styles.title}>
                  {t("transactions.import.previewTitle")}
                </Text>
                <Text style={styles.fileName} numberOfLines={1}>
                  {preview?.fileName}
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                style={styles.closeButton}
                disabled={isImporting}
              >
                <Icon name="close" size={15} />
              </Pressable>
            </View>

            <Text style={styles.summary}>
              {t("transactions.import.previewSummary", {
                count: preview?.transactions.length ?? 0,
              })}
            </Text>

            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator
            >
              {preview?.transactions.map(({ preview: transaction }, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  compact
                  withDivider={index < preview.transactions.length - 1}
                />
              ))}
            </ScrollView>

            <View style={styles.actions}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isImporting}
              >
                <Text style={styles.cancelText}>{t("common.cancel")}</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.importButton,
                  isImporting && styles.buttonDisabled,
                ]}
                onPress={onImport}
                disabled={isImporting}
              >
                <Text style={styles.importText}>
                  {isImporting
                    ? t("transactions.import.importing")
                    : t("transactions.import.confirm", {
                        count: preview?.transactions.length ?? 0,
                      })}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
