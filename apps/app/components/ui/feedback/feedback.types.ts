export type FeedbackType = "success" | "error" | "info" | "warning";

export type FeedbackMessage = {
  id: string;
  type: FeedbackType;
  message: string;
  duration?: number;
};