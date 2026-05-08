import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { Icon } from "@/components/icons/Icon";
import { IconName } from "@repo/shared-types";

type AvatarOption = {
  id: string;
  icon: IconName;
};

type AvatarPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply?: (avatar: { icon: IconName; backgroundColor: string }) => void;
};

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "avatar-1", icon: "user" },
  { id: "avatar-2", icon: "user" },
  { id: "avatar-3", icon: "user" },
  { id: "avatar-4", icon: "user" },
  { id: "avatar-5", icon: "user" },
  { id: "avatar-6", icon: "user" },
  { id: "avatar-7", icon: "user" },
  { id: "avatar-8", icon: "user" },
];

const WELMIO_AVATAR = require("@/assets/images/welmio-logo-no-circle.png");

// const COLORS = [
//   "#b8eadc",
//   "#dff7ef",
//   "#9ce1cf",
//   "#74d2bd",
//   "#58c5ad",
//   "#0f8f7c",
//   "#e6f8f3",
//   "#c8f1e5",
// ];

export function AvatarPickerModal({
  visible,
  onClose,
  onApply,
}: AvatarPickerModalProps) {
  const [selectedAvatarId, setSelectedAvatarId] = useState(
    AVATAR_OPTIONS[0].id,
  );
  const [selectedColor, setSelectedColor] = useState(WHITE);

  const selectedAvatar =
    AVATAR_OPTIONS.find((avatar) => avatar.id === selectedAvatarId) ??
    AVATAR_OPTIONS[0];

  function handleApply() {
    onApply?.({
      icon: selectedAvatar.icon,
      backgroundColor: selectedColor,
    });

    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Avatar</Text>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={20} strokeWidth={2.4} color={BLACK} />
            </Pressable>
          </View>

          <View style={styles.previewWrapper}>
            <View
              style={[styles.previewAvatar, { backgroundColor: selectedColor }]}
            >
              <Image
                source={WELMIO_AVATAR}
                style={styles.previewAvatarImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.previewText}>Choose your profile avatar</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.sectionTitle}>Avatar</Text>

            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = avatar.id === selectedAvatarId;

                return (
                  <Pressable
                    key={avatar.id}
                    style={[
                      styles.avatarOption,
                      isSelected && styles.selectedAvatarOption,
                    ]}
                    onPress={() => setSelectedAvatarId(avatar.id)}
                  >
                    <View
                      style={[
                        styles.avatarIconCircle,
                        { backgroundColor: selectedColor },
                      ]}
                    >
                      <Image
                        source={WELMIO_AVATAR}
                        style={styles.avatarOptionImage}
                        resizeMode="contain"
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* <Text style={styles.sectionTitle}>Color</Text>

            <View style={styles.colorGrid}>
              {COLORS.map((color) => {
                const isSelected = color === selectedColor;

                return (
                  <Pressable
                    key={color}
                    style={[
                      styles.colorOption,
                      isSelected && styles.selectedColorOption,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <View
                      style={[styles.colorCircle, { backgroundColor: color }]}
                    />
                  </Pressable>
                );
              })}
            </View> */}

            <View style={styles.actions}>
              <AuthButton title="Apply" onPress={handleApply} />

              <AuthButton
                title="Cancel"
                variant="secondary"
                onPress={onClose}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const GREEN = "#12c79b";
const LIGHT_GREEN = "#dff7ef";
const SOFT_GREEN = "#e7f8f2";
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const MUTED = "#5f7472";
const BORDER = "rgba(18, 199, 155, 0.14)";
const CARD_BORDER = "rgba(5, 46, 43, 0.06)";
const OVERLAY = "rgba(223, 247, 239, 0.92)";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: OVERLAY,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalCard: {
    width: "100%",
    maxWidth: 368,
    maxHeight: "88%",
    backgroundColor: WHITE,
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    shadowColor: "rgba(5, 46, 43, 0.12)",
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    color: BLACK,
    fontFamily: fonts.bold,
    letterSpacing: 0.2,
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  previewWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },

  previewAvatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(18, 199, 155, 0.18)",
  },

  previewAvatarImage: {
    width: 90,
    height: 90,
  },

  previewText: {
    fontSize: 13,
    color: MUTED,
    fontFamily: fonts.medium,
  },

  content: {
    paddingBottom: 8,
  },

  sectionTitle: {
    fontSize: 15,
    color: BLACK,
    fontFamily: fonts.bold,
    marginBottom: 14,
    letterSpacing: 0.1,
  },

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 28,
  },

  avatarOption: {
    width: 68,
    height: 68,
    borderRadius: 17,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(5, 46, 43, 0.05)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  selectedAvatarOption: {
    borderWidth: 1.5,
    borderColor: GREEN,
    backgroundColor: "rgba(223, 247, 239, 0.52)",
  },

  avatarIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarOptionImage: {
    width: 50,
    height: 50,
  },

  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },

  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedColorOption: {
    borderWidth: 2,
    borderColor: GREEN,
  },

  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  actions: {
    alignItems: "center",
    gap: 12,
  },
});
