import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { AuthButton } from "@/features/auth/components/AuthButton";
import { Icon} from "@/components/icons/Icon";
import { IconName } from "@repo/shared-types";

type AvatarOption = {
  id: string;
  icon: IconName;
};

type AvatarPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply?: (avatar: {
    icon: IconName;
    backgroundColor: string;
  }) => void;
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

const COLORS = [
  "#00c896",
  "#38bdf8",
  "#a78bfa",
  "#f472b6",
  "#fb923c",
  "#facc15",
  "#34d399",
  "#ef4444",
];

export function AvatarPickerModal({
  visible,
  onClose,
  onApply,
}: AvatarPickerModalProps) {
  const [selectedAvatarId, setSelectedAvatarId] = useState(AVATAR_OPTIONS[0].id);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

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
              style={[
                styles.previewAvatar,
                { backgroundColor: selectedColor },
              ]}
            >
              <Icon
                name={selectedAvatar.icon}
                size={46}
                strokeWidth={1.8}
                color={BLACK}
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
                      <Icon
                        name={avatar.icon}
                        size={28}
                        strokeWidth={1.8}
                        color={BLACK}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Color</Text>

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
                      style={[
                        styles.colorCircle,
                        { backgroundColor: color },
                      ]}
                    />
                  </Pressable>
                );
              })}
            </View>

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

const GREEN = "#00c896";
const LIGHT_GREEN = "#f1fff3";
const SOFT_GREEN = "#dff7e2";
const WHITE = "#ffffff";
const BLACK = "#052e2b";
const BORDER = "rgba(5, 46, 43, 0.12)";
const OVERLAY = "rgba(0, 0, 0, 0.72)";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: OVERLAY,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalCard: {
    width: "100%",
    maxWidth: 350,
    maxHeight: "78%",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    color: BLACK,
    fontFamily: fonts.bold,
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
    marginBottom: 22,
  },

  previewAvatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  previewText: {
    fontSize: 13,
    color: BLACK,
    opacity: 0.7,
    fontFamily: fonts.medium,
  },

  content: {
    paddingBottom: 8,
  },

  sectionTitle: {
    fontSize: 15,
    color: BLACK,
    fontFamily: fonts.bold,
    marginBottom: 12,
  },

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },

  avatarOption: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedAvatarOption: {
    borderWidth: 2,
    borderColor: GREEN,
  },

  avatarIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 26,
  },

  colorOption: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedColorOption: {
    borderWidth: 2,
    borderColor: GREEN,
  },

  colorCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },

  actions: {
    alignItems: "center",
    gap: 12,
  },
});