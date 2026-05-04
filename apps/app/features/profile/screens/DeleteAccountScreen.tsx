import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { AuthInput } from "@/features/auth/components/AuthInput";
import { AuthButton } from "@/features/auth/components/AuthButton";

export default function DeleteAccountScreen() {
  const [password, setPassword] = useState("");

  function handleDeleteAccount() {
    console.log({
      password,
    });
  }

  function handleCancel() {
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.headerArea}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrowLeft" size={22} color={BLACK} />
        </Pressable>

        <Text style={styles.title}>Delete Account</Text>

        <Pressable style={styles.notifications}>
          <Icon name="bell" size={22} color={BLACK} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardContent}
        >
          <Text style={styles.confirmTitle}>
            Are You Sure You Want To Delete{"\n"}Your Account?
          </Text>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              This action will permanently delete all of your data, and you will
              not be able to recover it. Please keep the following in mind
              before proceeding:
            </Text>

            <Text style={styles.bulletText}>
              • All your expenses, income and associated transactions will be
              eliminated.
            </Text>

            <Text style={styles.bulletText}>
              • You will not be able to access your account or any related
              information.
            </Text>

            <Text style={styles.bulletText}>
              • This action cannot be undone.
            </Text>
          </View>

          <Text style={styles.passwordTitle}>
            Please Enter Your Password To Confirm{"\n"}Deletion Of Your Account.
          </Text>

          <View style={styles.form}>
            <AuthInput
              label=""
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
            />

            <View style={styles.buttons}>
              <AuthButton
                title="Yes, Delete Account"
                onPress={handleDeleteAccount}
              />

              <AuthButton
                title="Cancel"
                onPress={handleCancel}
                variant="secondary"
                />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";
const BOX_GREEN = "#dff6e3";
const BLACK = "#052e2b";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GREEN,
  },

  headerArea: {
    height: 150,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 30,
  },

  title: {
    fontSize: 16,
    color: BLACK,
    fontFamily: fonts.bold,
  },

  notifications: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    flex: 1,
    backgroundColor: LIGHT_GREEN,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    padding: 24,
  },

  cardContent: {
    paddingTop: 28,
    paddingBottom: 70,
  },

  confirmTitle: {
    fontSize: 16,
    color: BLACK,
    fontFamily: fonts.medium,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  warningBox: {
    backgroundColor: BOX_GREEN,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 20,
    marginBottom: 28,
  },

  warningText: {
    fontSize: 12,
    color: BLACK,
    fontFamily: fonts.regular,
    lineHeight: 17,
    marginBottom: 14,
  },

  bulletText: {
    fontSize: 12,
    color: BLACK,
    fontFamily: fonts.regular,
    lineHeight: 17,
    marginBottom: 10,
  },

  passwordTitle: {
    fontSize: 14,
    color: BLACK,
    fontFamily: fonts.medium,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 22,
  },

  form: {
    gap: 18,
  },

  buttons: {
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
});