import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { AppScreenHeader } from "@/components/ui/app-screen-header/AppScreenHeader";

const BACKGROUND = "#dff7ef";
const CARD = "#fbfffd";
const MINT = "#d9f6ec";
const MINT_STRONG = "#14b894";
const BORDER = "rgba(20, 184, 148, 0.13)";
const TEXT = "#073b38";
const MUTED = "#6f8580";
const WHITE = "#ffffff";

export default function SecurityScreen() {
  return (
    <View style={styles.screen}>
      <AppScreenHeader title="Security" />

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardContent}
        >
          <Text style={styles.sectionTitle}>Security Settings</Text>

          <View style={styles.optionsContainer}>
            <SecurityOption
              icon="key"
              label="Change Pin"
              description="Update your secure access pin"
            />

            <SecurityOption
              icon="fingerPrint"
              label="Fingerprint"
              description="Manage biometric authentication"
            />

            <SecurityOption
              icon="document"
              label="Terms And Conditions"
              description="Review app security and usage terms"
            />
          </View>
        </ScrollView>
      </View>

      <LinearGradient
        pointerEvents="none"
        colors={["rgba(223, 247, 239, 0)", BACKGROUND]}
        style={styles.bottomFade}
      />
    </View>
  );
}

type SecurityOptionProps = {
  icon: any;
  label: string;
  description?: string;
};

function SecurityOption({ icon, label, description }: SecurityOptionProps) {
  const isFingerprint = icon === "fingerPrint";

  return (
    <Pressable style={styles.optionRow}>
      <View style={styles.optionLeft}>
        <View style={styles.optionIcon}>
          <Icon
            name={icon}
            size={isFingerprint ? 25 : 21}
            strokeWidth={isFingerprint ? 6: 2}
            color={MINT_STRONG}
          />
        </View>

        <View style={styles.optionTextWrap}>
          <Text style={styles.optionLabel}>{label}</Text>
          {description ? (
            <Text style={styles.optionDescription}>{description}</Text>
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

  cardContent: {
    paddingTop: 30,
    paddingBottom: 120,
  },

  sectionTitle: {
    fontSize: 18,
    color: TEXT,
    fontFamily: fonts.bold,
    marginBottom: 18,
    paddingHorizontal: 4,
  },

  optionsContainer: {
    gap: 14,
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
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
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

  optionDescription: {
    fontSize: 12,
    color: MUTED,
    fontFamily: fonts.regular,
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
