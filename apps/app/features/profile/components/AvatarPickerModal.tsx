import { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
const WELMIO_BASE_AVATAR = require("@/assets/images/welmio-logo.png");
const WELMIO_AVATAR_1 = require("@/assets/images/welmio-avatar-1.png");
const WELMIO_AVATAR_2 = require("@/assets/images/welmio-avatar-2.png");
const WELMIO_AVATAR_3 = require("@/assets/images/welmio-avatar-3.png");
const WELMIO_AVATAR_4 = require("@/assets/images/welmio-avatar-4.png");
const WELMIO_AVATAR_5 = require("@/assets/images/welmio-avatar-5.png");
const WELMIO_AVATAR_6 = require("@/assets/images/welmio-avatar-6.png");
const WELMIO_AVATAR_7 = require("@/assets/images/welmio-avatar-7.png");
const WELMIO_AVATAR_8 = require("@/assets/images/welmio-avatar-8.png");
const WELMIO_AVATAR_9 = require("@/assets/images/welmio-avatar-9.png");

export const AVATAR_IMAGES = {
  "avatar-0": WELMIO_BASE_AVATAR,
  "avatar-1": WELMIO_AVATAR_1,
  "avatar-2": WELMIO_AVATAR_2,
  "avatar-3": WELMIO_AVATAR_3,
  "avatar-4": WELMIO_AVATAR_4,
  "avatar-5": WELMIO_AVATAR_5,
  "avatar-6": WELMIO_AVATAR_6,
  "avatar-7": WELMIO_AVATAR_7,
  "avatar-8": WELMIO_AVATAR_8,
  "avatar-9": WELMIO_AVATAR_9,
} satisfies Record<string, ImageSourcePropType>;

export type AvatarId = keyof typeof AVATAR_IMAGES;

type AvatarOption = {
  id: AvatarId;
  image: ImageSourcePropType;
};

type AvatarPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedAvatarId?: AvatarId;
  onApply?: (avatar: {
    id: AvatarId;
    image: ImageSourcePropType;
    backgroundColor: string;
  }) => void;
};

const AVATAR_OPTIONS: AvatarOption[] = Object.entries(AVATAR_IMAGES).map(
  ([id, image]) => ({ id: id as AvatarId, image }),
);

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
  selectedAvatarId: currentAvatarId = AVATAR_OPTIONS[0].id,
  onApply,
}: AvatarPickerModalProps) {
  const [selectedAvatarId, setSelectedAvatarId] =
    useState<AvatarId>(currentAvatarId);
  const [selectedColor, setSelectedColor] = useState(WHITE);

  useEffect(() => {
    if (visible) {
      setSelectedAvatarId(currentAvatarId);
    }
  }, [currentAvatarId, visible]);

  const selectedAvatar =
    AVATAR_OPTIONS.find((avatar) => avatar.id === selectedAvatarId) ??
    AVATAR_OPTIONS[0];

  function handleApply() {
    onApply?.({
      id: selectedAvatar.id,
      image: selectedAvatar.image,
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
                source={selectedAvatar.image}
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
                        source={avatar.image}
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
              <Pressable style={styles.clearButton} onPress={onClose}>
                <Text style={styles.clearButtonText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </Pressable>
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
const BUTTON_GREEN = "#c9f3df";

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
    position: "relative",
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    color: BLACK,
    fontFamily: fonts.bold,
    letterSpacing: 0.2,
    textAlign: "center",
  },

  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
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
    justifyContent: "center",
    rowGap: 12,
    columnGap: 10,
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
    flexDirection: "row",
    gap: 14,
    marginTop: 8,
  },

  clearButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: SOFT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  clearButtonText: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  applyButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonDisabled: {
    opacity: 0.5,
  },

  applyButtonText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: BLACK,
  },
});
