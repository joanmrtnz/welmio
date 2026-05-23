import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { fonts } from "@/theme/fonts";

const BACKGROUND = "#dff7ef";
const CARD = "#ffffff";
const PRIMARY_DARK = "#008f73";
const TEXT = "#073b3a";
const MUTED = "#6f8185";
const DESKTOP_BREAKPOINT = 768;
const DESKTOP_CONTENT_WIDTH = 920;

const LEGAL_CONTACT_EMAIL = "privacy@welmio.dev";
const LICENSE_NAME = "non-commercial source-available license";

const TERMS_SECTIONS = [
  {
    title: "1. Acceptance of these terms",
    body: "By creating an account or using Welmio, you agree to these terms. If you do not agree, you should not use the app. These terms are intended for a first public portfolio version and may be updated as the project evolves.",
  },
  {
    title: "2. About Welmio",
    body: "Welmio is a personal finance tracking app created as a real portfolio project to demonstrate software development skills. It helps users organize accounts, categories, transactions, goals and financial summaries. It is not a commercial financial product.",
  },
  {
    title: "3. Portfolio and non-commercial purpose",
    body: "The app is provided mainly for demonstration, educational and portfolio purposes. The project may be publicly available on GitHub, but the code is intended to be used only under the license defined in the repository. Commercial use, resale or use of the code in paid products is not allowed unless the license or the developer explicitly permits it.",
  },
  {
    title: "4. Source code license",
    body: `The source code is made available under a ${LICENSE_NAME}. This means the code can be reviewed for learning and portfolio evaluation, but it must not be copied, sold, integrated into commercial products or used to provide commercial services unless the license says otherwise. Always check the LICENSE file in the repository.`,
  },
  {
    title: "5. Account responsibility",
    body: "You are responsible for keeping your login credentials secure and for the information you add to your account. Use a strong password and do not share your account with other people. You must not try to access accounts, data or API endpoints that do not belong to you.",
  },
  {
    title: "6. No financial advice",
    body: "Welmio is only an organizational tool. It does not provide financial, legal, tax, accounting or investment advice. Charts, totals and analytics are generated from the data you enter and should not be used as the sole basis for financial decisions.",
  },
  {
    title: "7. Acceptable use",
    body: "You agree not to abuse the service, attack the API, bypass authentication, exploit vulnerabilities, scrape data, upload malicious content or use the app for illegal activity. If you discover a security issue, please report it responsibly instead of exploiting it.",
  },
  {
    title: "8. Availability and homelab hosting",
    body: "Welmio is self-hosted from a homelab in Spain. The service may be interrupted because of maintenance, network issues, power outages, hardware changes or project updates. No guarantee is made that the app will be available continuously.",
  },
  {
    title: "9. Data and account deletion",
    body: "You can update your profile and request or use the account deletion flow when available. Deleting your account will remove or anonymize your personal data where technically possible, although limited logs or backups may remain temporarily for security, debugging or legal reasons.",
  },
  {
    title: "10. Limitation of liability",
    body: "Welmio is provided as a portfolio project on an as-is basis. The developer is not responsible for losses, incorrect data, service interruptions, decisions made using the app, or issues caused by user misuse, except where applicable law says otherwise.",
  },
  {
    title: "11. Changes to the service or terms",
    body: "Features, routes, integrations and these terms may change over time. If there are important changes, reasonable efforts will be made to make them visible in the app or repository.",
  },
  {
    title: "12. Contact",
    body: `For questions about these terms, privacy or responsible security reports, contact ${LEGAL_CONTACT_EMAIL}.`,
  },
];

export default function TermsOfUseScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
      >
        <View style={[styles.header, isDesktop && styles.headerDesktop]}>
          <Pressable
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <FontAwesome name="angle-left" size={26} color={TEXT} />
          </Pressable>

          <View style={styles.headerTextWrap}>
            <Text style={[styles.eyebrow, isDesktop && styles.eyebrowDesktop]}>
              Welmio legal
            </Text>
            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
              Terms of Use
            </Text>
            <Text style={[styles.subtitle, isDesktop && styles.subtitleDesktop]}>
              Terms for using Welmio as a non-commercial portfolio app.
            </Text>
          </View>
        </View>

        <View style={[styles.card, isDesktop && styles.cardDesktop]}>

          <Text style={styles.updatedText}>Last updated: May 2026</Text>

          <View style={styles.sectionsWrap}>
            {TERMS_SECTIONS.map((section) => (
              <View key={section.title} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionBody}>{section.body}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 28,
  },

  scrollContentDesktop: {
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 48,
    alignItems: "center",
  },

  header: {
    width: "100%",
    marginBottom: 20,
  },

  headerDesktop: {
    maxWidth: DESKTOP_CONTENT_WIDTH,
    marginBottom: 26,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  headerTextWrap: {
    gap: 8,
  },

  eyebrow: {
    color: PRIMARY_DARK,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontFamily: fonts.bold,
  },

  eyebrowDesktop: {
    fontSize: 13,
  },

  title: {
    color: TEXT,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
    fontFamily: fonts.bold,
  },

  titleDesktop: {
    fontSize: 40,
    lineHeight: 46,
  },

  subtitle: {
    maxWidth: 560,
    color: MUTED,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: fonts.regular,
  },

  subtitleDesktop: {
    fontSize: 16,
    lineHeight: 25,
  },

  card: {
    width: "100%",
    backgroundColor: CARD,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: "rgba(7, 59, 58, 0.06)",
    shadowColor: "rgba(7, 59, 58, 0.09)",
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },

  cardDesktop: {
    maxWidth: DESKTOP_CONTENT_WIDTH,
    borderRadius: 32,
    paddingHorizontal: 38,
    paddingVertical: 36,
  },

  updatedText: {
    marginTop: 22,
    color: MUTED,
    fontSize: 12,
    fontFamily: fonts.semibold,
  },

  sectionsWrap: {
    marginTop: 22,
    gap: 22,
  },

  section: {
    gap: 8,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.bold,
  },

  sectionBody: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 23,
    fontFamily: fonts.regular,
  },
});
