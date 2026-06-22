import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "@/lib/i18n";
import { fonts } from "@/theme/fonts";
import { AppImage } from "@/components/images/AppImage";

const WELMIO_LOGO = require("@/assets/images/welmio-logo.png");

const GREEN = "#dff7ef";
const PRIMARY = "#00b889";
const PRIMARY_DARK = "#079374";
const DARK = "#052e2b";
const MUTED = "#6f8586";
const CARD = "#ffffff";
const SOFT_GREEN = "#e3f8f1";

export default function FingerprintScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.desktopShell, isDesktop && styles.desktopShellActive]}
        >
          <View
            style={[styles.desktopHero, isDesktop && styles.desktopHeroActive]}
          >
            <View
              style={[styles.brandArea, isDesktop && styles.brandAreaDesktop]}
            >
              <View style={styles.brandRow}>
                <View style={styles.logoBadge}>
                  <AppImage source={WELMIO_LOGO} style={styles.logoImage} />
                </View>

                <Text
                  style={[
                    styles.brandName,
                    isDesktop && styles.brandNameDesktop,
                  ]}
                >
                  {t("common.appName")}
                </Text>
              </View>
            </View>

            <View
              style={[styles.avatarWrap, isDesktop && styles.avatarWrapDesktop]}
            >
              <View
                style={[
                  styles.avatarCircle,
                  isDesktop && styles.avatarCircleDesktop,
                ]}
              >
                <Ionicons
                  name="finger-print-outline"
                  size={isDesktop ? 82 : 58}
                  color={PRIMARY}
                />
              </View>
            </View>

            {isDesktop ? (
              <View style={styles.desktopCopy}>
                <Text style={styles.desktopTitle}>
                  {t("auth.fingerprintScreen.desktopTitle")}
                </Text>

                <Text style={styles.desktopSubtitle}>
                  {t("auth.fingerprintScreen.desktopSubtitle")}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.desktopFormColumn}>
            <View style={[styles.card, isDesktop && styles.cardDesktop]}>
              <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
                {t("auth.fingerprintScreen.title")}
              </Text>

              <Text
                style={[styles.subtitle, isDesktop && styles.subtitleDesktop]}
              >
                {t("auth.fingerprintScreen.subtitle")}
              </Text>

              <View
                style={[styles.infoCard, isDesktop && styles.infoCardDesktop]}
              >
                <View style={styles.infoIcon}>
                  <FontAwesome name="lock" size={19} color={PRIMARY} />
                </View>

                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoTitle}>
                    {t("auth.fingerprintScreen.infoTitle")}
                  </Text>

                  <Text style={styles.infoText}>
                    {t("auth.fingerprintScreen.infoText")}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.actionButtons,
                  isDesktop && styles.actionButtonsDesktop,
                ]}
              >
                <Pressable
                  onPress={() => {
                    // TODO: trigger biometric auth
                    router.replace("/(public)/login");
                  }}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    isDesktop && styles.primaryButtonDesktop,
                    pressed ? styles.buttonPressed : null,
                  ]}
                >
                  <Ionicons
                    name="finger-print-outline"
                    size={22}
                    color="#ffffff"
                  />

                  <Text style={styles.primaryButtonText}>
                    {t("auth.fingerprintScreen.useTouchId")}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    router.push("/(public)/login");
                  }}
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    isDesktop && styles.secondaryButtonDesktop,
                    pressed ? styles.buttonPressed : null,
                  ]}
                >
                  <Text style={styles.secondaryButtonText}>
                    {t("auth.fingerprintScreen.usePinInstead")}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {!isDesktop ? (
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(223, 247, 239, 0)", "rgba(223, 247, 239, 0.92)"]}
          style={styles.bottomFade}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 34,
    paddingBottom: 30,
  },

  scrollContentDesktop: {
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },

  desktopShell: {
    width: "100%",
  },

  desktopShellActive: {
    maxWidth: 1040,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 42,
  },

  desktopHero: {
    position: "relative",
    zIndex: 2,
  },

  desktopHeroActive: {
    flex: 1,
    maxWidth: 430,
    alignItems: "center",
  },

  desktopFormColumn: {
    width: "100%",
    flex: 1,
    maxWidth: 460,
    position: "relative",
    zIndex: 1,
  },

  brandArea: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 72,
  },

  brandAreaDesktop: {
    marginTop: 0,
    marginBottom: 24,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  logoBadge: {
    width: 31,
    height: 31,
    borderRadius: 18,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(29, 100, 89, 0.18)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  logoImage: {
    width: 30,
    height: 30,
  },

  brandName: {
    fontSize: 24,
    color: DARK,
    fontFamily: fonts.bold,
  },

  brandNameDesktop: {
    fontSize: 30,
  },

  avatarWrap: {
    position: "relative",
    zIndex: 20,
    elevation: 20,
    alignItems: "center",
    marginBottom: -42,
  },

  avatarWrapDesktop: {
    marginBottom: 22,
  },

  avatarCircle: {
    position: "relative",
    zIndex: 20,
    width: 112,
    height: 112,
    borderRadius: 60,
    backgroundColor: "#c9f2e3",
    borderWidth: 4,
    borderColor: PRIMARY_DARK,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(29, 100, 89, 0.16)",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  avatarCircleDesktop: {
    width: 156,
    height: 156,
    borderRadius: 82,
  },

  desktopCopy: {
    width: "100%",
    paddingHorizontal: 8,
    alignItems: "center",
  },

  desktopTitle: {
    color: DARK,
    fontSize: 34,
    lineHeight: 40,
    textAlign: "center",
    fontFamily: fonts.bold,
  },

  desktopSubtitle: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    marginTop: 14,
    fontFamily: fonts.medium,
  },

  card: {
    position: "relative",
    zIndex: 1,
    backgroundColor: CARD,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 30,
    shadowColor: "rgba(29, 100, 89, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },

  cardDesktop: {
    paddingHorizontal: 34,
    paddingTop: 38,
    paddingBottom: 34,
  },

  title: {
    fontSize: 26,
    color: DARK,
    fontFamily: fonts.bold,
    textAlign: "center",
    marginBottom: 10,
  },

  titleDesktop: {
    fontSize: 28,
  },

  subtitle: {
    alignSelf: "center",
    maxWidth: 280,
    fontSize: 15,
    lineHeight: 22,
    color: MUTED,
    fontFamily: fonts.regular,
    textAlign: "center",
    marginBottom: 28,
  },

  subtitleDesktop: {
    maxWidth: 340,
    fontFamily: fonts.medium,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SOFT_GREEN,
    borderRadius: 22,
    padding: 15,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "rgba(0, 184, 137, 0.08)",
  },

  infoCardDesktop: {
    padding: 18,
    marginBottom: 30,
  },

  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#d5f6eb",
    alignItems: "center",
    justifyContent: "center",
  },

  infoTextWrap: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    color: DARK,
    fontFamily: fonts.bold,
    marginBottom: 3,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 17,
    color: MUTED,
    fontFamily: fonts.regular,
  },

  actionButtons: {
    alignItems: "center",
    gap: 20,
  },

  actionButtonsDesktop: {
    gap: 14,
  },

  primaryButton: {
    width: "90%",
    height: 54,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    shadowColor: "rgba(0, 184, 137, 0.25)",
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  primaryButtonDesktop: {
    width: "100%",
    maxWidth: 320,
  },

  primaryButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: fonts.bold,
  },

  secondaryButton: {
    minWidth: 190,
    height: 44,
    borderRadius: 24,
    backgroundColor: "rgba(227, 248, 241, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  secondaryButtonDesktop: {
    minWidth: 0,
    width: "100%",
    maxWidth: 320,
  },

  secondaryButtonText: {
    fontSize: 14,
    color: PRIMARY_DARK,
    fontFamily: fonts.bold,
  },

  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
  },
});