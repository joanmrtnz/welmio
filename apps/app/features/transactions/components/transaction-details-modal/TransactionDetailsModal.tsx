import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Icon } from "@/components/icons/Icon";
import type { TransactionDetailsModalProps } from "../../types/transactionDetails.types";
import {
  BLACK,
  RED,
  WHITE,
  styles,
} from "./transactionDetails.styles";
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
      console.warn("[TransactionDetailsModal] delete transaction error:", error);
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
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCard}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Transaction details</Text>
              <Text style={styles.subtitle}>
                {formatDate(transaction.date)}
              </Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                style={styles.iconButton}
                onPress={handleEditTransaction}
              >
                <Icon
                  name="edit"
                  size={16}
                  strokeWidth={1.5}
                  color={BLACK}
                />
              </Pressable>

              <Pressable
                style={[styles.iconButton, styles.deleteIconButton]}
                onPress={handleOpenDeleteDialog}
                disabled={isDeleting}
              >
                <Icon
                  name="bin"
                  size={23}
                  strokeWidth={1.5}
                  color={RED}
                />
              </Pressable>

              <Pressable style={styles.iconButton} onPress={onClose}>
                <Icon name="close" size={20} color={BLACK} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            <View style={styles.heroCard}>
              <View style={styles.categoryIcon}>
                <Icon
                  name={(transaction.category?.icon ?? "plus") as any}
                  size={65}
                  strokeWidth={1}
                  color={WHITE}
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
                  {transaction.type.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>
                  {transaction.category?.name ?? "Not set"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account</Text>
                <Text style={styles.detailValue}>
                  {transaction.account?.name ?? "Not set"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Currency</Text>
                <Text style={styles.detailValue}>
                  {transaction.currency}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nature</Text>
                <Text style={styles.detailValue}>
                  {formatValue(transaction.transactionNature)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Frequency</Text>
                <Text style={styles.detailValue}>
                  {formatValue(transaction.frequencyType)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {formatDate(transaction.date)}
                </Text>
              </View>
            </View>

            <View style={styles.notesCard}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>
                {transaction.notes?.trim() || "No notes added."}
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
                  color={WHITE}
                />
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={handleOpenDeleteDialog}
                disabled={isDeleting}
              >
                <Icon
                  name="bin"
                  size={23}
                  strokeWidth={2}
                  color={RED}
                />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </ScrollView>

          <ConfirmDialog
            visible={showDeleteDialog}
            title="Delete Transaction"
            message={`Are you sure you want to delete this transaction?
            This action cannot be undone.`}
            confirmLabel="Yes, Delete"
            cancelLabel="Cancel"
            loadingLabel="Deleting..."
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