import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "@/lib/i18n";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";
import { feedback } from "@/components/ui/feedback/feedback.service";

const BACKGROUND = "#dff7ef";
const CARD = "#fbfffd";
const MINT = "#d9f6ec";
const MINT_STRONG = "#14b894";
const BORDER = "rgba(20, 184, 148, 0.13)";
const TEXT = "#073b38";
const MUTED = "#6f8580";
const WHITE = "#ffffff";
const DESKTOP_BREAKPOINT = 768;
const DESKTOP_CONTENT_WIDTH = 1040;

const APP_URL = process.env.WELMIO_APP_URL?.trim();
export const TERMS_URL = APP_URL
  ? `${APP_URL.replace(/\/$/, "")}/terms`
  : "";

export const PRIVACY_URL = APP_URL
  ? `${APP_URL.replace(/\/$/, "")}/privacy`
  : "";

export default function LegalScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported && APP_URL) {
        await Linking.openURL(url);
      } else {
        feedback.error("Invalid URL");
      }
    } catch (error) {
      console.error("An error occurred opening the link", error);
    }
  };

  return (
    <View style={styles.screen}>
      <AppScreenHeader title={t("profile.legal.title") || "Legal"} />

      <View style={[styles.card, isDesktop && styles.cardDesktop]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.cardContent,
            isDesktop && styles.cardContentDesktop,
          ]}
        >
          <View style={isDesktop && styles.desktopHeaderBlock}>
            <Text
              style={[
                styles.sectionTitle,
                isDesktop && styles.sectionTitleDesktop,
              ]}
            >
              {t("profile.legal.sectionTitle") || "Legal Documents"}
            </Text>
          </View>

          <View
            style={[
              styles.optionsContainer,
              isDesktop && styles.optionsContainerDesktop,
            ]}
          >
            <LegalCardOption
              icon="document"
              label={t("profile.legal.terms") || "Terms of Use"}
              description={t("profile.legal.termsDescription") || "Read our terms and conditions"}
              onPress={() => handleOpenLink(TERMS_URL)}
              isDesktop={isDesktop}
            />

            <LegalCardOption
              icon="shield"
              label={t("profile.legal.privacy") || "Privacy Policy"}
              description={t("profile.legal.privacyDescription") || "Read our privacy guidelines"}
              onPress={() => handleOpenLink(PRIVACY_URL)}
              isDesktop={isDesktop}
            />
          </View>
        </ScrollView>
      </View>

      {!isDesktop ? (
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(223, 247, 239, 0)", BACKGROUND]}
          style={styles.bottomFade}
        />
      ) : null}
    </View>
  );
}

type LegalCardOptionProps = {
  icon: any;
  label: string;
  description?: string;
  onPress?: () => void;
  isDesktop?: boolean;
};

function LegalCardOption({
  icon,
  label,
  description,
  onPress,
  isDesktop,
}: LegalCardOptionProps) {
  return (
    <Pressable
      style={[styles.optionRow, isDesktop && styles.optionRowDesktop]}
      onPress={onPress}
    >
      <View style={styles.optionLeft}>
        <View style={styles.optionIcon}>
          <Icon name={icon} size={35} color={MINT_STRONG} />
        </View>

        <View style={styles.optionTextWrap}>
          <Text
            style={[styles.optionLabel, isDesktop && styles.optionLabelDesktop]}
          >
            {label}
          </Text>

          {description ? (
            <Text
              style={[
                styles.optionDescription,
                isDesktop && styles.optionDescriptionDesktop,
              ]}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.chevronWrap}>
        <Icon name="chevronRight" size={20} color={TEXT} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  card: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: CARD,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "rgba(7, 59, 56, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: -4 },
    elevation: 4,
  },

  cardDesktop: {
    width: "100%",
    maxWidth: DESKTOP_CONTENT_WIDTH,
    alignSelf: "center",
    flex: 0,
    minHeight: 400,
    marginHorizontal: 32,
    marginTop: 18,
    borderRadius: 34,
    paddingHorizontal: 28,
    shadowColor: "rgba(7, 59, 56, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  cardContent: {
    paddingTop: 30,
    paddingBottom: 120,
  },

  cardContentDesktop: {
    paddingTop: 34,
    paddingBottom: 44,
  },

  desktopHeaderBlock: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: fonts.bold,
    marginBottom: 18,
    paddingHorizontal: 4,
  },

  sectionTitleDesktop: {
    fontSize: 24,
    marginBottom: 8,
    paddingHorizontal: 0,
  },

  optionsContainer: {
    gap: 14,
  },

  optionsContainerDesktop: {
    marginTop: 20,
    gap: 20,
  },

  optionRow: {
    minHeight: 84,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WHITE,
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(7, 59, 56, 0.035)",
    shadowColor: "rgba(7, 59, 56, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  optionRowDesktop: {
    minHeight: 92,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 24,
  },

  optionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: MINT,
    alignItems: "center",
    justifyContent: "center",
  },

  optionTextWrap: {
    flex: 1,
  },

  optionLabel: {
    fontSize: 15,
    color: TEXT,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },

  optionLabelDesktop: {
    fontSize: 16,
  },

  optionDescription: {
    fontSize: 12,
    color: MUTED,
    fontFamily: fonts.regular,
  },

  optionDescriptionDesktop: {
    fontSize: 13,
  },

  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 130,
  },
});