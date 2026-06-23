import { I18n } from "i18n-js";
import { getDeviceLocale } from "./locale";
import {
  fallbackLocale,
  supportedLocales,
  translations,
  type SupportedLocale,
} from "./translations";
import { getStoredLocale, setStoredLocale } from "./language-storage";

export const i18n = new I18n(translations);

i18n.locale = getDeviceLocale();
i18n.enableFallback = true;

export const t = i18n.t.bind(i18n);

export function normalizeLocale(locale?: string | null): SupportedLocale {
  const languageCode = locale?.split("-")[0];

  if (supportedLocales.includes(languageCode as SupportedLocale)) {
    return languageCode as SupportedLocale;
  }

  return fallbackLocale;
}

export function getCurrentLocale(): SupportedLocale {
  return normalizeLocale(i18n.locale);
}

export async function hydrateStoredLocale(): Promise<SupportedLocale> {
  const storedLocale = await getStoredLocale();

  const nextLocale = storedLocale
    ? normalizeLocale(storedLocale)
    : getDeviceLocale();

  i18n.locale = nextLocale;

  return nextLocale;
}

export async function setAppLocale(locale: SupportedLocale): Promise<void> {
  const nextLocale = normalizeLocale(locale);

  i18n.locale = nextLocale;
  await setStoredLocale(nextLocale);
}

export function translateWithLocale(
  locale: SupportedLocale,
  key: string,
  options?: Record<string, unknown>,
) {
  return i18n.t(key, {
    ...options,
    locale,
  });
}

export default i18n;