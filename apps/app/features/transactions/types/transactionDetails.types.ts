import type { TransactionOverviewItem } from "@repo/shared-types";

export type TransactionDetailsItem = TransactionOverviewItem;

export type TransactionDetailsModalProps = {
  visible: boolean;
  transaction: TransactionOverviewItem | null;
  onClose: () => void;
  onEdit: (transaction: TransactionOverviewItem) => void;
  onDelete: (transaction: TransactionOverviewItem) => void | Promise<void>;
};