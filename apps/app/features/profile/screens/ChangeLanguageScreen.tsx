import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { SupportedLocale } from "@/lib/i18n/translations";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";

const TEAL = "#00c896";
const DARK_TEAL = "#063b3a";
const SOFT_TEAL = "#a9efdf";
const VERY_SOFT_TEAL = "#dff7ef";
const CARD = "#fbfffd";
const WHITE = "#ffffff";
const MUTED = "#5e7b78";
const INPUT_BG = "#eef8f2";
const GRID = "rgba(6, 59, 58, 0.09)";
const DESKTOP_CONTENT_WIDTH = 1040;

type LanguageOption = {
  locale: SupportedLocale;
  labelKey: string;
  descriptionKey: string;
};

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    locale: "en",
    labelKey: "profile.language.options.en.label",
    descriptionKey: "profile.language.options.en.description",
  },
  {
    locale: "es",
    labelKey: "profile.language.options.es.label",
    descriptionKey: "profile.language.options.es.description",
  },
  {
    locale: "ca",
    labelKey: "profile.language.options.ca.label",
    descriptionKey: "profile.language.options.ca.description",
  },
];

export default function ChangeLanguageScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { locale, changeLocale } = useLocale();

  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>(locale);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedLocale(locale);
  }, [locale]);

  const selectedLanguageLabel = useMemo(() => {
    const selectedOption = LANGUAGE_OPTIONS.find(
      (option) => option.locale === selectedLocale,
    );

    if (!selectedOption) {
      return t("profile.language.options.en.label");
    }

    return t(selectedOption.labelKey);
  }, [selectedLocale, locale]);

  async function handleSaveLanguage() {
    try {
      setIsSaving(true);

      await changeLocale(selectedLocale);

      feedback.success(t("profile.language.feedback.updateSuccess"));
    } catch (error) {
      console.warn(error);
      feedback.error(t("profile.language.feedback.updateError"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.screen}>
      <AppScreenHeader title={t("profile.language.title")} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          isDesktop && styles.contentDesktop,
        ]}
      >
        <View style={[styles.mobileStack, isDesktop && styles.desktopGrid]}>
          <View
            style={[styles.mobileStack, isDesktop && styles.desktopLeftColumn]}
          >
            <View
              style={[
                styles.languageCard,
                isDesktop && styles.languageCardDesktop,
              ]}
            >
              <View style={styles.heroIconWrap}>
                <View style={styles.heroIcon}>
                  <Icon name="language" size={40} strokeWidth={1.8} color={TEAL} />
                </View>
              </View>

              <View style={styles.headingBlock}>
                <Text style={styles.sectionTitle}>
                  {t("profile.language.hero.title")}
                </Text>

                <Text style={styles.description}>
                  {t("profile.language.hero.description")}
                </Text>
              </View>
            </View>

            <View
              style={[styles.noticeCard, isDesktop && styles.noticeCardDesktop]}
            >
              <View style={styles.noticeIcon}>
                <FontAwesome name="globe" size={28} color={TEAL} />
              </View>

              <View style={styles.noticeTextWrap}>
                <Text style={styles.noticeTitle}>
                  {t("profile.language.notice.title")}
                </Text>

                <Text style={styles.noticeText}>
                  {t("profile.language.notice.description")}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.formCard, isDesktop && styles.formCardDesktop]}>
            <Text style={styles.formTitle}>
              {t("profile.language.form.title")}
            </Text>

            <Text style={styles.currentLanguageText}>
              {t("profile.language.form.currentLanguage", {
                language: selectedLanguageLabel,
              })}
            </Text>

            <View style={styles.languageList}>
              {LANGUAGE_OPTIONS.map((option) => {
                const isSelected = option.locale === selectedLocale;

                return (
                  <Pressable
                    key={option.locale}
                    onPress={() => setSelectedLocale(option.locale)}
                    style={({ pressed }) => [
                      styles.languageOption,
                      isSelected && styles.languageOptionSelected,
                      pressed && styles.languageOptionPressed,
                    ]}
                  >
                    <View style={styles.languageOptionTextWrap}>
                      <Text
                        style={[
                          styles.languageOptionTitle,
                          isSelected && styles.languageOptionTitleSelected,
                        ]}
                      >
                        {t(option.labelKey)}
                      </Text>

                      <Text style={styles.languageOptionDescription}>
                        {t(option.descriptionKey)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.radio,
                        isSelected && styles.radioSelected,
                      ]}
                    >
                      {isSelected ? (
                        <FontAwesome name="check" size={13} color={WHITE} />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.updateButton,
                isDesktop && styles.updateButtonDesktop,
                pressed && styles.updateButtonPressed,
                isSaving && styles.updateButtonDisabled,
              ]}
              onPress={handleSaveLanguage}
              disabled={isSaving}
            >
              <Text style={styles.updateButtonText}>
                {isSaving
                  ? t("profile.language.form.actions.saving")
                  : t("profile.language.form.actions.saveLanguage")}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: VERY_SOFT_TEAL,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 118,
  },

  contentDesktop: {
    width: "100%",
    maxWidth: DESKTOP_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingBottom: 150,
  },

  mobileStack: {
    width: "100%",
  },

  desktopGrid: {
    width: "100%",
    flexDirection: "row",
    gap: 24,
    alignItems: "flex-start",
  },

  desktopLeftColumn: {
    flex: 0.9,
    gap: 18,
  },

  languageCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 24,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  languageCardDesktop: {
    minHeight: 252,
    justifyContent: "center",
    marginBottom: 0,
    paddingHorizontal: 28,
    paddingVertical: 30,
  },

  heroIconWrap: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: SOFT_TEAL,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  heroIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },

  headingBlock: {
    alignItems: "center",
    paddingHorizontal: 8,
  },

  sectionTitle: {
    fontSize: 21,
    lineHeight: 27,
    color: DARK_TEAL,
    fontFamily: fonts.bold,
    marginBottom: 8,
    textAlign: "center",
  },

  description: {
    fontSize: 13,
    color: MUTED,
    fontFamily: fonts.medium,
    lineHeight: 19,
    textAlign: "center",
  },

  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: CARD,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  noticeCardDesktop: {
    marginBottom: 0,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  noticeIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: VERY_SOFT_TEAL,
    alignItems: "center",
    justifyContent: "center",
  },

  noticeTextWrap: {
    flex: 1,
  },

  noticeTitle: {
    fontSize: 14,
    color: DARK_TEAL,
    fontFamily: fonts.bold,
    marginBottom: 3,
  },

  noticeText: {
    fontSize: 12,
    color: MUTED,
    fontFamily: fonts.regular,
    lineHeight: 17,
  },

  formCard: {
    backgroundColor: CARD,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  formCardDesktop: {
    flex: 1.15,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },

  formTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: DARK_TEAL,
    marginBottom: 8,
  },

  currentLanguageText: {
    color: MUTED,
    fontSize: 12,
    fontFamily: fonts.medium,
    lineHeight: 18,
    marginBottom: 16,
  },

  languageList: {
    gap: 12,
  },

  languageOption: {
    minHeight: 70,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GRID,
    backgroundColor: INPUT_BG,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  languageOptionSelected: {
    borderColor: TEAL,
    backgroundColor: WHITE,
  },

  languageOptionPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.995 }],
  },

  languageOptionTextWrap: {
    flex: 1,
  },

  languageOptionTitle: {
    color: DARK_TEAL,
    fontSize: 15,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },

  languageOptionTitleSelected: {
    color: TEAL,
  },

  languageOptionDescription: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: fonts.regular,
  },

  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(6, 59, 58, 0.22)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
  },

  radioSelected: {
    borderColor: TEAL,
    backgroundColor: TEAL,
  },

  updateButton: {
    alignSelf: "center",
    marginTop: 24,
    width: "100%",
    maxWidth: 320,
    height: 52,
    borderRadius: 26,
    backgroundColor: TEAL,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 200, 150, 0.28)",
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  updateButtonDesktop: {
    alignSelf: "flex-start",
    width: 220,
  },

  updateButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  updateButtonDisabled: {
    opacity: 0.65,
  },

  updateButtonText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});