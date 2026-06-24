import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentLocale,
  hydrateStoredLocale,
  setAppLocale,
} from "./index";
import type { SupportedLocale } from "./translations";

type LocaleContextValue = {
  locale: SupportedLocale;
  changeLocale: (locale: SupportedLocale) => Promise<void>;
  refreshLocale: () => Promise<void>;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<SupportedLocale>(getCurrentLocale());

  const refreshLocale = useCallback(async () => {
    const nextLocale = await hydrateStoredLocale();
    setLocale(nextLocale);
  }, []);

  const changeLocale = useCallback(async (nextLocale: SupportedLocale) => {
    await setAppLocale(nextLocale);
    setLocale(nextLocale);
  }, []);

  useEffect(() => {
    void refreshLocale();
  }, [refreshLocale]);

  const value = useMemo(
    () => ({
      locale,
      changeLocale,
      refreshLocale,
    }),
    [locale, changeLocale, refreshLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const value = useContext(LocaleContext);

  if (!value) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return value;
}