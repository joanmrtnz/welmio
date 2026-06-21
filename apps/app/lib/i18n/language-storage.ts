
import { deleteStorageItem, getStorageItem, setStorageItem } from "../auth-storage";
import type { SupportedLocale } from "./translations";

const LANGUAGE_STORAGE_KEY = "welmio.language";

export async function getStoredLocale() {
  return getStorageItem(LANGUAGE_STORAGE_KEY);
}

export async function setStoredLocale(locale: SupportedLocale) {
  await setStorageItem(LANGUAGE_STORAGE_KEY, locale);
}

export async function clearStoredLocale() {
  await deleteStorageItem(LANGUAGE_STORAGE_KEY);
}