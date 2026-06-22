import { useEffect } from "react";
import { AppState } from "react-native";
import { hydrateStoredLocale } from "./index";

export const useSyncLocale = (): void => {
  useEffect(() => {
    void hydrateStoredLocale();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;

      void hydrateStoredLocale();
    });

    return () => {
      subscription.remove();
    };
  }, []);
};