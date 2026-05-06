import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { fonts } from "@/theme/fonts";

const WELMIO_LOGO = require("@/assets/images/welmio-logo-no-circle.png");

const GREEN = "#dff7ef";
const PRIMARY = "#00b889";
const PRIMARY_DARK = "#079374";
const DARK = "#052e2b";
const MUTED = "#6f8586";
const CARD = "#ffffff";
const SOFT_GREEN = "#e3f8f1";

export default function FingerprintScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandArea}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Image
                source={WELMIO_LOGO}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandName}>Welmio</Text>
          </View>
        </View>

        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <Ionicons name="finger-print-outline" size={58} color={PRIMARY} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Use Touch ID</Text>

          <Text style={styles.subtitle}>
            Unlock Welmio faster and keep your account protected with biometric
            access.
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <FontAwesome name="lock" size={19} color={PRIMARY} />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoTitle}>Secure access</Text>
              <Text style={styles.infoText}>
                Your fingerprint stays on this device and is never shared with
                Welmio.
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Pressable
              onPress={() => {
                // TODO: trigger biometric auth
                router.replace("/(public)/login");
              }}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed ? styles.buttonPressed : null,
              ]}
            >
              <Ionicons name="finger-print-outline" size={22} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Use Touch ID</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                router.push("/(public)/login");
              }}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed ? styles.buttonPressed : null,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Use pin code instead</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <LinearGradient
        pointerEvents="none"
        colors={["rgba(223, 247, 239, 0)", "rgba(223, 247, 239, 0.92)"]}
        style={styles.bottomFade}
      />
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

  brandArea: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 72,
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
    backgroundColor: CARD,
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

  avatarWrap: {
    zIndex: 2,
    alignItems: "center",
    marginBottom: -42,
  },

  avatarCircle: {
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

  card: {
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

  title: {
    fontSize: 26,
    color: DARK,
    fontFamily: fonts.bold,
    textAlign: "center",
    marginBottom: 10,
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
    shadowOffset: { width: 0, height: 6},
    elevation: 6,
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
