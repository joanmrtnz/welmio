import { I18n } from "i18n-js";
import { getDeviceLocale } from "./locale";
import { translations } from "./translations";

export const i18n = new I18n(translations);

i18n.locale = getDeviceLocale();

i18n.enableFallback = true;

export const t = i18n.t.bind(i18n);

export default i18n;