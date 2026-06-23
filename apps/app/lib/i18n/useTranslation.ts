import { useCallback } from "react";

import { translateWithLocale } from "./index";
import { useLocale } from "./LocaleProvider";

export function useTranslation() {
  const { locale, changeLocale, refreshLocale } = useLocale();

  const translate = useCallback(
    (key: string, options?: Record<string, unknown>) => {
      return translateWithLocale(locale, key, options);
    },
    [locale],
  );

  return {
    t: translate,
    locale,
    changeLocale,
    refreshLocale,
  };
}