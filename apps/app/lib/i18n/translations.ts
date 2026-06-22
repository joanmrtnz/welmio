import ca from "./locales/ca";
import en from "./locales/en";
import es from "./locales/es";

export const translations = {
  ca,
  en,
  es,
};

export const supportedLocales = ["ca", "en", "es"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const fallbackLocale: SupportedLocale = "en";