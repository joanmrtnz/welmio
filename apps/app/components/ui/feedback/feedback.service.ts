import type { FeedbackMessage, FeedbackType } from "./feedback.types";

type FeedbackListener = (message: FeedbackMessage) => void;

let listener: FeedbackListener | null = null;

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function emit(type: FeedbackType, message: string, duration = 2500) {
  listener?.({
    id: createId(),
    type,
    message,
    duration,
  });
}

export const feedback = {
  subscribe(nextListener: FeedbackListener) {
    listener = nextListener;

    return () => {
      listener = null;
    };
  },

  success(message: string, duration?: number) {
    emit("success", message, duration);
  },

  error(message: string, duration?: number) {
    emit("error", message, duration);
  },

  info(message: string, duration?: number) {
    emit("info", message, duration);
  },

  warning(message: string, duration?: number) {
    emit("warning", message, duration);
  },
};