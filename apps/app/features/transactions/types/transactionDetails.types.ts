import type { TransactionOverviewItem } from "@repo/shared-types";

export type TransactionDetailsItem = TransactionOverviewItem;

export type TransactionDetailsModalProps = {
  visible: boolean;
  transaction: TransactionDetailsItem | null;
  onClose: () => void;
  onEdit: (transaction: TransactionDetailsItem) => void;
  onDelete: (transaction: TransactionDetailsItem) => void;
};