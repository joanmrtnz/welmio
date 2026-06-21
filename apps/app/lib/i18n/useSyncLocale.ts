import { useEffect } from "react";
import { AppState } from "react-native";
import i18n from "./index";
import { getDeviceLocale } from "./locale";

export const useSyncLocale = (): void => {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;

      i18n.locale = getDeviceLocale();
    });

    return () => {
      subscription.remove();
    };
  }, []);
};