import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { fonts } from "@/theme/fonts";
import { feedback } from "@/components/ui/feedback/feedback.service";
import { verifyAccountEmail, verifyEmailChange } from "../services/email-verification-service";

type Status = "idle" | "success" | "error";

export default function VerifyEmailChangeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const params = useLocalSearchParams<{ token?: string | string[] }>();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const token = useMemo(() => {
    const value = params.token;
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
  }, [params.token]);

  const hasToken = token.trim().length > 0;

  async function handleVerifyEmail() {
    try {
      if (!hasToken) {
        feedback.error("Verification token is missing.");
        setStatus("error");
        return;
      }

      setIsLoading(true);

      await verifyEmailChange(token);

      setStatus("success");
      feedback.success("Your email has been verified.");
    } catch (error) {
      console.warn(error);
      setStatus("error");
      feedback.error("We could not verify your email.");
    } finally {
      setIsLoading(false);
    }
  }

  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        isDesktop && styles.contentDesktop,
      ]}
    >
      <View style={[styles.card, isDesktop && styles.cardDesktop]}>
        <View
          style={[
            styles.heroIconWrap,
            isSuccess && styles.heroIconWrapSuccess,
            isError && styles.heroIconWrapError,
          ]}
        >
          <View style={styles.heroIcon}>
            <FontAwesome
              name={isSuccess ? "check" : isError ? "exclamation" : "envelope"}
              size={34}
              color={isError ? ERROR : TEAL}
            />
          </View>
        </View>

        <Text style={styles.title}>
          {isSuccess
            ? "Your Welmio account email has been updated."
            : isError
              ? "Verification failed"
              : "Verify your new email"}
        </Text>

        <Text style={styles.description}>
          {isSuccess
            ? "Your Welmio account email has been updated. You can continue to the app."
            : isError
              ? "The verification link may be expired or invalid. You can request a new verification email from the app."
              : "Press the button below to verify your email address and activate your Welmio account."}
        </Text>


        {!isSuccess ? (
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              (!hasToken || isLoading) && styles.primaryButtonDisabled,
            ]}
            onPress={handleVerifyEmail}
            disabled={!hasToken || isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? "Verifying..." : "Verify email"}
            </Text>
          </Pressable>
        ) : (
          // <Pressable
          //   style={({ pressed }) => [
          //     styles.primaryButton,
          //     pressed && styles.primaryButtonPressed,
          //   ]}
          //   onPress={() => router.replace("/login")}
          // >
          <Text style={styles.primaryButtonText}>You can return to the app.</Text>
          //   </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const TEAL = "#00c896";
const DARK_TEAL = "#063b3a";
const SOFT_TEAL = "#a9efdf";
const VERY_SOFT_TEAL = "#dff7ef";
const CARD = "#fbfffd";
const WHITE = "#ffffff";
const MUTED = "#5e7b78";
const ERROR = "#d64545";
const ERROR_BG = "#ffe3e3";
const DESKTOP_CONTENT_WIDTH = 520;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: VERY_SOFT_TEAL,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 42,
    justifyContent: "center",
  },

  contentDesktop: {
    width: "100%",
    maxWidth: DESKTOP_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingVertical: 70,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },

  cardDesktop: {
    paddingHorizontal: 34,
    paddingVertical: 38,
  },

  heroIconWrap: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: SOFT_TEAL,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  heroIconWrapSuccess: {
    backgroundColor: SOFT_TEAL,
  },

  heroIconWrapError: {
    backgroundColor: ERROR_BG,
  },

  heroIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    lineHeight: 28,
    color: DARK_TEAL,
    fontFamily: fonts.bold,
    marginBottom: 10,
    textAlign: "center",
  },

  description: {
    fontSize: 14,
    color: MUTED,
    fontFamily: fonts.medium,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 26,
  },

  primaryButton: {
    alignSelf: "center",
    minWidth: 210,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#c9f3df",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    shadowColor: "rgba(29, 100, 89, 0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  primaryButtonPressed: {
    opacity: 0.82,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: DARK_TEAL,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});