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
const RESPONSIBLE_NAME = "Welmio developer";
const HOSTING_LOCATION = "Spain";

const PRIVACY_SECTIONS = [
  {
    title: "1. Data controller",
    body: `Welmio is operated by ${RESPONSIBLE_NAME} as a personal portfolio and source-available project. For privacy requests, you can contact the controller at ${LEGAL_CONTACT_EMAIL}.`,
  },
  {
    title: "2. What Welmio is",
    body: "Welmio is a real personal finance management app built as a professional portfolio project. It is not a commercial product, bank, financial institution or financial advisory service. The source code may be publicly available under a non-commercial license.",
  },
  {
    title: "3. Data we collect",
    body: "We collect the information needed to create and use your account: name, email address, encrypted password, optional phone number, optional date of birth, avatar preferences, accounts, categories, transactions, goals, contributions and app settings. We may also process basic technical data such as IP address, request logs, device/browser information and security events.",
  },
  {
    title: "4. Why we use your data",
    body: "We use your data to create and secure your account, authenticate you, verify your email, let you manage your financial records, calculate summaries and analytics, recover your password, send account-related emails, prevent abuse and keep the service working reliably.",
  },
  {
    title: "5. Legal basis",
    body: "The main legal basis is the provision of the service requested by the user when creating and using an account. Optional profile data may be processed based on your consent or voluntary action. Security logs and abuse prevention may be processed based on legitimate interest in protecting the app and its users.",
  },
  {
    title: "6. Hosting and infrastructure",
    body: `The main app infrastructure is self-hosted in a homelab located in ${HOSTING_LOCATION}. This means availability may be more limited than in a commercial cloud service. Reasonable technical measures are applied, but this project should be understood as a portfolio application, not a commercial managed service.`,
  },
  {
    title: "7. Third-party services",
    body: "Welmio may use trusted third-party providers only when needed to operate the app. For example, Resend may be used to send verification, password reset and security emails. GitHub may host the public source code, but it is not used to store user account data.",
  },
  {
    title: "8. Data retention",
    body: "Your account data is kept while your account remains active. If you delete your account, personal data will be deleted or anonymized where technically possible, except for limited technical logs, backups or records that may need to be retained temporarily for security, debugging or legal reasons.",
  },
  {
    title: "9. Your rights",
    body: `If you are in the EU/Spain, you may request access, rectification, deletion, restriction, portability and objection regarding your personal data. You can contact ${LEGAL_CONTACT_EMAIL}. You also have the right to lodge a complaint with the Spanish Data Protection Agency (AEPD).`,
  },
  {
    title: "10. Security",
    body: "Welmio uses basic security measures such as password hashing, JWT authentication, email verification, protected private endpoints, validation, rate limiting and restricted CORS for web clients. No system is completely secure, especially in a self-hosted portfolio context, so avoid storing sensitive information that you do not need in the app.",
  },
  {
    title: "11. Changes to this policy",
    body: "This policy may be updated as the project evolves, especially if new features, providers or deployment environments are added. The latest version will be available in the app or repository.",
  },
];

export default function PrivacyPolicyScreen() {
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
              Welmio privacy
            </Text>
            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
              Privacy Policy
            </Text>
            <Text style={[styles.subtitle, isDesktop && styles.subtitleDesktop]}>
              How Welmio handles personal data in this portfolio app.
            </Text>
          </View>
        </View>

        <View style={[styles.card, isDesktop && styles.cardDesktop]}>
          <Text style={styles.updatedText}>Last updated: May 2026</Text>

          <View style={styles.sectionsWrap}>
            {PRIVACY_SECTIONS.map((section) => (
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
