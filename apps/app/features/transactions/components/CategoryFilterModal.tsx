import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";
import { apiFetch } from "@/app/lib/api/client";

const WHITE = "#ffffff";
const BLACK = "#052e2b";
const LIGHT_GREEN = "#f1fff3";
const BUTTON_GREEN = "#1A9E6A";
const DARK_GREEN = "#059669";
const TAB_GREEN = "#14cfa1";
const LIGTH_GRAY = "rgba(0,0,0,0.1)";

type CategoryType = "income" | "expense";

type Category = {
  id: string;
  name: string;
  color?: string | null;
  icon?: string | null;
  type: CategoryType;
};

type CategoriesOverviewResponse = {
  categories: Category[];
};

type CategoryFilterModalProps = {
  visible: boolean;
  selectedCategoryIds: string[];
  onClose: () => void;
  onApply: (categoryIds: string[]) => void;
  onAddMoreCategories: () => void;
};

export function CategoryFilterModal({
  visible,
  selectedCategoryIds,
  onClose,
  onApply,
  onAddMoreCategories,
}: CategoryFilterModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [draftSelectedIds, setDraftSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;

    setDraftSelectedIds(selectedCategoryIds);

    async function loadCategories() {
      try {
        const response = await apiFetch<CategoriesOverviewResponse>(
          "/categories/overview",
        );

        setCategories(response.categories);
      } catch (error) {
        console.warn(error);
      }
    }

    loadCategories();
  }, [visible, selectedCategoryIds]);

  function toggleCategory(categoryId: string) {
    setDraftSelectedIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  }

  function clearFilters() {
    setDraftSelectedIds([]);
  }

  function applyFilters() {
    onApply(draftSelectedIds);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter by category</Text>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={15} color={BLACK} />
            </Pressable>
          </View>

          <View style={styles.grid}>
            {categories.map((item) => {
              const isSelected = draftSelectedIds.includes(item.id);

              return (
                <Pressable
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => toggleCategory(item.id)}
                >
                  <View
                    style={[
                      styles.gridIcon,
                      isSelected && styles.gridIconSelected,
                    ]}
                  >
                    <Icon
                      name={(item.icon ?? "plus") as any}
                      size={52}
                      color={isSelected ? WHITE : WHITE}
                    />
                  </View>

                  <Text
                    style={[
                      styles.gridLabel,
                      isSelected && styles.gridLabelSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.addMoreButton} onPress={onAddMoreCategories}>
            
            <Icon name="plus" size={23} color={BLACK} />
           
            <Text style={styles.addMoreText}>Add more categories</Text>
          </Pressable>

          <View style={styles.actions}>
            <Pressable style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>

            <Pressable style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply filter</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modalCard: {
    width: "100%",
    maxHeight: "72%",
    backgroundColor: LIGHT_GREEN,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: BLACK,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LIGTH_GRAY,
    alignItems: "center",
    justifyContent: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gridItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 28,
  },

  gridIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: BUTTON_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: BUTTON_GREEN,
  },

  gridIconSelected: {
    backgroundColor: TAB_GREEN,
   
  },

  gridLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: BLACK,
    textAlign: "center",
  },

  gridLabelSelected: {
    
    color: DARK_GREEN,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  clearButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: LIGTH_GRAY,
    alignItems: "center",
    justifyContent: "center",
  },

  clearButtonText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  applyButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: TAB_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: WHITE,
  },

  addMoreButton: {
    height: 46,
    borderRadius: 16,
    backgroundColor: LIGHT_GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
    },

    addMoreText: {
        fontSize: 13,
        fontFamily: fonts.semibold,
        color: BLACK,
        },
});