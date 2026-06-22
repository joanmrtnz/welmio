import { t } from "@/lib/i18n";

export function getGreetingLabel() {
  const hour = new Date().getHours();

  if (hour < 12) return t("home.greetings.morning");
  if (hour < 18) return t("home.greetings.afternoon");

  return t("home.greetings.evening");
}