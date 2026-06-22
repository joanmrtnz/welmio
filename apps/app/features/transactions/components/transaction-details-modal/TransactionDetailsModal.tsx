import { useState } from "react";
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
import type { TransactionDetailsModalProps } from "../../types/transactionDetails.types";
import { BLACK, RED, TAB_GREEN, styles } from "./transactionDetails.styles";
import {
  formatAmount,
  formatDate,
  formatValue,
} from "../../utils/transactionDetails.utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog/ConfirmDialog";

export function TransactionDetailsModal({
  visible,
  transaction,
  onClose,
  onEdit,
  onDelete,
}: TransactionDetailsModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!transaction) return null;

  const isExpense = transaction.type === "expense";

  function handleOpenDeleteDialog() {
    setShowDeleteDialog(true);
  }

  function handleCloseDeleteDialog() {
    if (isDeleting) return;

    setShowDeleteDialog(false);
  }

  async function handleConfirmDeleteTransaction() {
    if (!transaction || isDeleting) return;

    try {
      setIsDeleting(true);

      await onDelete(transaction);

      setShowDeleteDialog(false);
    } catch (error) {
      console.warn(
        "[TransactionDetailsModal] delete transaction error:",
        error,
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEditTransaction() {
    if (!transaction) return;

    onEdit(transaction);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalRoot, isDesktop && styles.modalRootDesktop]}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {t("transactions.details.title")}
              </Text>

              <Text style={styles.subtitle}>
                {formatDate(transaction.date)}
              </Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                style={styles.iconButton}
                onPress={handleEditTransaction}
              >
                <Icon name="edit" size={17} strokeWidth={1.7} color={BLACK} />
              </Pressable>

              <Pressable
                style={[styles.iconButton, styles.deleteIconButton]}
                onPress={handleOpenDeleteDialog}
                disabled={isDeleting}
              >
                <Icon name="bin" size={22} strokeWidth={1.7} color={RED} />
              </Pressable>

              <Pressable style={styles.iconButton} onPress={onClose}>
                <Icon name="close" size={18} strokeWidth={1.8} color={BLACK} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.content,
              isDesktop && styles.contentDesktop,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            <View
              style={[styles.bodyLayout, isDesktop && styles.bodyLayoutDesktop]}
            >
              <View
                style={[styles.heroCard, isDesktop && styles.heroCardDesktop]}
              >
                <View style={styles.categoryIcon}>
                  <Icon
                    name={(transaction.category?.icon ?? "plus") as any}
                    size={48}
                    strokeWidth={1}
                    color={TAB_GREEN}
                  />
                </View>

                <Text style={styles.description}>
                  {transaction.description}
                </Text>

                <Text
                  style={[
                    styles.amount,
                    isExpense ? styles.expenseAmount : styles.incomeAmount,
                  ]}
                >
                  {formatAmount(transaction)}
                </Text>

                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>
                    {isExpense
                      ? t("transactions.types.expense").toUpperCase()
                      : t("transactions.types.income").toUpperCase()}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.detailsColumn,
                  isDesktop && styles.detailsColumnDesktop,
                ]}
              >
                <View
                  style={[
                    styles.detailsCard,
                    isDesktop && styles.detailsCardDesktop,
                  ]}
                >
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {t("transactions.details.category")}
                    </Text>

                    <Text style={styles.detailValue}>
                      {transaction.category?.name ??
                        t("transactions.details.notSet")}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {t("transactions.details.account")}
                    </Text>

                    <Text style={styles.detailValue}>
                      {transaction.account?.name ??
                        t("transactions.details.notSet")}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {t("transactions.details.currency")}
                    </Text>

                    <Text style={styles.detailValue}>
                      {transaction.currency}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {t("transactions.details.nature")}
                    </Text>

                    <Text style={styles.detailValue}>
                      {formatValue(transaction.transactionNature)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {t("transactions.details.frequency")}
                    </Text>

                    <Text style={styles.detailValue}>
                      {formatValue(transaction.frequencyType)}
                    </Text>
                  </View>

                  <View style={[styles.detailRow, styles.detailRowLast]}>
                    <Text style={styles.detailLabel}>
                      {t("transactions.details.date")}
                    </Text>

                    <Text style={styles.detailValue}>
                      {formatDate(transaction.date)}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.notesCard,
                    isDesktop && styles.notesCardDesktop,
                  ]}
                >
                  <Text style={styles.notesLabel}>
                    {t("transactions.details.notes")}
                  </Text>

                  <Text style={styles.notesText}>
                    {transaction.notes?.trim() ||
                      t("transactions.details.noNotesAdded")}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <Pressable
                    style={styles.editButton}
                    onPress={handleEditTransaction}
                  >
                    <Icon
                      name="edit"
                      size={16}
                      strokeWidth={1.8}
                      color={BLACK}
                    />

                    <Text style={styles.editButtonText}>
                      {t("transactions.details.edit")}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.deleteButton}
                    onPress={handleOpenDeleteDialog}
                    disabled={isDeleting}
                  >
                    <Icon name="bin" size={23} strokeWidth={2} color={RED} />

                    <Text style={styles.deleteButtonText}>
                      {t("transactions.details.delete")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>

          <ConfirmDialog
            visible={showDeleteDialog}
            title={t("transactions.details.deleteDialog.title")}
            message={t("transactions.details.deleteDialog.message")}
            confirmLabel={t("transactions.details.deleteDialog.confirmLabel")}
            cancelLabel={t("transactions.details.deleteDialog.cancelLabel")}
            loadingLabel={t("transactions.details.deleteDialog.loadingLabel")}
            destructive
            isLoading={isDeleting}
            onConfirm={handleConfirmDeleteTransaction}
            onCancel={handleCloseDeleteDialog}
          />
        </View>
      </View>
    </Modal>
  );
}