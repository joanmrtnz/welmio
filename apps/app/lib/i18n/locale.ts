import { getLocales } from "expo-localization";
import { fallbackLocale, supportedLocales, type SupportedLocale } from "./translations";

export const getDeviceLocale = (): SupportedLocale => {
  const deviceLanguage = getLocales()[0]?.languageCode;

  if (supportedLocales.includes(deviceLanguage as SupportedLocale)) {
    return deviceLanguage as SupportedLocale;
  }

  return fallbackLocale;
};

export const getDeviceLanguageTag = (): string => {
  return getLocales()[0]?.languageTag ?? fallbackLocale;
};