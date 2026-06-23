import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { SvgProps } from "react-native-svg";

import SpainFlag from "@/assets/icons/flags/spain_flag.svg";
import EnglishFlag from "@/assets/icons/flags/english_flag.svg";
import CataloniaFlag from "@/assets/icons/flags/catalonia_flag.svg";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { SupportedLocale } from "@/lib/i18n/translations";
import { fonts } from "@/theme/fonts";

const GREEN = "#dff7ef";
const PRIMARY_DARK = "#079374";
const DARK = "#052e2b";
const CARD = "#ffffff";

type PublicAuthLanguageSelectorProps = {
  style?: StyleProp<ViewStyle>;
};

type PublicAuthLanguageOption = {
  locale: SupportedLocale;
  label: string;
  Flag: ComponentType<SvgProps>;
};

const DEFAULT_LANGUAGE_OPTION: PublicAuthLanguageOption = {
  locale: "es",
  label: "ES",
  Flag: SpainFlag,
};

const LANGUAGE_OPTIONS: PublicAuthLanguageOption[] = [
  DEFAULT_LANGUAGE_OPTION,
  {
    locale: "en",
    label: "EN",
    Flag: EnglishFlag,
  },
  {
    locale: "ca",
    label: "CA",
    Flag: CataloniaFlag,
  },
];

export function PublicAuthLanguageSelector({
  style,
}: PublicAuthLanguageSelectorProps) {
  const { locale, changeLocale } = useLocale();

  const [selectedLocale, setSelectedLocale] =
    useState<SupportedLocale>(locale);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  useEffect(() => {
    setSelectedLocale(locale);
  }, [locale]);

  const selectedLanguage = useMemo(() => {
    return (
      LANGUAGE_OPTIONS.find((option) => option.locale === selectedLocale) ??
      DEFAULT_LANGUAGE_OPTION
    );
  }, [selectedLocale]);

  async function handleChangeLanguage(nextLocale: SupportedLocale) {
    if (nextLocale === selectedLocale || isChangingLanguage) {
      setIsDropdownOpen(false);
      return;
    }

    try {
      setIsChangingLanguage(true);
      setSelectedLocale(nextLocale);
      setIsDropdownOpen(false);

      await changeLocale(nextLocale);
    } catch (error) {
      setSelectedLocale(locale);
      feedback.error(t("profile.language.feedback.updateError"));
      console.warn(error);
    } finally {
      setIsChangingLanguage(false);
    }
  }

  const SelectedFlag = selectedLanguage.Flag;

  return (
    <View style={[styles.languageDropdownWrap, style]}>
      <Pressable
        disabled={isChangingLanguage}
        onPress={() => setIsDropdownOpen((isOpen) => !isOpen)}
        style={({ pressed }) => [
          styles.languageDropdownTrigger,
          pressed && !isChangingLanguage
            ? styles.languageDropdownPressed
            : null,
        ]}
      >
        <View style={styles.languageSelectedContent}>
          <View style={styles.languageFlagWrap}>
            <SelectedFlag width={28} height={20} />
          </View>

          <Text style={styles.languageSelectedLabel}>
            {selectedLanguage.label}
          </Text>
        </View>

        <FontAwesome
          name={isDropdownOpen ? "chevron-up" : "chevron-down"}
          size={11}
          color={PRIMARY_DARK}
        />
      </Pressable>

      {isDropdownOpen ? (
        <View style={styles.languageDropdownMenu}>
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = option.locale === selectedLocale;
            const Flag = option.Flag;

            return (
              <Pressable
                key={option.locale}
                disabled={isChangingLanguage}
                onPress={() => handleChangeLanguage(option.locale)}
                style={({ pressed }) => [
                  styles.languageDropdownItem,
                  isSelected && styles.languageDropdownItemSelected,
                  pressed && !isChangingLanguage
                    ? styles.languageDropdownPressed
                    : null,
                ]}
              >
                <View style={styles.languageSelectedContent}>
                  <View style={styles.languageFlagWrap}>
                    <Flag width={28} height={20} />
                  </View>

                  <Text
                    style={[
                      styles.languageItemLabel,
                      isSelected && styles.languageItemLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>

                {isSelected ? (
                  <FontAwesome name="check" size={12} color={PRIMARY_DARK} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  languageDropdownWrap: {
    width: 100,
    alignSelf: "center",
    marginTop: 15,
    zIndex: 30,
    elevation: 30,
  },

  languageDropdownTrigger: {
    height: 40,
    borderRadius: 15,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(5, 46, 43, 0.20)",
    paddingLeft: 9,
    paddingRight: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  languageDropdownPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },

  languageSelectedContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },

  languageFlagWrap: {
    width: 34,
    height: 24,
    borderRadius: 7,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
    backgroundColor: CARD,
  },

  languageSelectedLabel: {
    color: DARK,
    fontSize: 12,
    fontFamily: fonts.bold,
  },

  languageDropdownMenu: {
    position: "absolute",
    right: 0,
    bottom: 48,
    width: 100,
    borderRadius: 18,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: "rgba(5, 46, 43, 0.08)",
    padding: 6,
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 30,
    zIndex: 40,
  },

  languageDropdownItem: {
    minHeight: 38,
    borderRadius: 14,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  languageDropdownItemSelected: {
    backgroundColor: GREEN,
  },

  languageItemLabel: {
    color: DARK,
    fontSize: 12,
    fontFamily: fonts.bold,
  },

  languageItemLabelSelected: {
    color: PRIMARY_DARK,
  },
});