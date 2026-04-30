import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
type ModalMode = "filter" | "create";

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
};

const CATEGORY_ICONS = [
  { name: "groceries", label: "Food" },
  { name: "car", label: "Transport" },
  { name: "rent", label: "Rent" },
  { name: "medicine", label: "Medicine" },
  { name: "gift", label: "Gifts" },
  { name: "ticket", label: "Fun" },
  { name: "savings", label: "Savings" },
  { name: "money", label: "Money" },
  { name: "plane", label: "Travel" },
  { name: "book", label: "Books" },
] as const;

const CATEGORY_COLORS = [
  "#16a34a",
  "#14cfa1",
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
];

export function CategoryFilterModal({
  visible,
  selectedCategoryIds,
  onClose,
  onApply,
}: CategoryFilterModalProps) {
  const [mode, setMode] = useState<ModalMode>("filter");

  const [categories, setCategories] = useState<Category[]>([]);
  const [draftSelectedIds, setDraftSelectedIds] = useState<string[]>([]);

  const [categoryName, setCategoryName] = useState("");
  const [selectedType, setSelectedType] = useState<CategoryType>("expense");
  const [selectedIcon, setSelectedIcon] = useState("plus");
  const [selectedColor, setSelectedColor] = useState("#16a34a");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setMode("filter");
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

  function resetCreateForm() {
    setCategoryName("");
    setSelectedType("expense");
    setSelectedIcon("plus");
    setSelectedColor("#16a34a");
  }

  function handleClose() {
    setMode("filter");
    resetCreateForm();
    onClose();
  }

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
    handleClose();
  }

  async function createCategory() {
    const trimmedName = categoryName.trim();

    if (!trimmedName || isSaving) return;

    try {
      setIsSaving(true);

      const newCategory = await apiFetch<Category>("/categories", {
        method: "POST",
        body: JSON.stringify({
          name: trimmedName,
          type: selectedType,
          icon: selectedIcon,
          color: selectedColor,
        }),
      });

      setCategories((prev) => [...prev, newCategory]);
      setDraftSelectedIds((prev) => [...prev, newCategory.id]);

      resetCreateForm();
      setMode("filter");
    } catch (error) {
      console.warn(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.modalCard}>
          {mode === "filter" ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Filter by category</Text>

                <Pressable onPress={handleClose} style={styles.closeButton}>
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
                          color={WHITE}
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

              <Pressable
                style={styles.addMoreButton}
                onPress={() => setMode("create")}
              >
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
            </>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>New Category</Text>

                <Pressable
                  onPress={() => {
                    resetCreateForm();
                    setMode("filter");
                  }}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={15} color={BLACK} />
                </Pressable>
              </View>

              <TextInput
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Category name"
                placeholderTextColor="rgba(5, 46, 43, 0.45)"
                style={styles.input}
              />

              <Text style={styles.sectionLabel}>Type</Text>

              <View style={styles.typeRow}>
                <Pressable
                  style={[
                    styles.typeButton,
                    selectedType === "income" && styles.typeButtonSelected,
                  ]}
                  onPress={() => setSelectedType("income")}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedType === "income" &&
                        styles.typeButtonTextSelected,
                    ]}
                  >
                    Income
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.typeButton,
                    selectedType === "expense" && styles.typeButtonSelected,
                  ]}
                  onPress={() => setSelectedType("expense")}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedType === "expense" &&
                        styles.typeButtonTextSelected,
                    ]}
                  >
                    Expense
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.sectionLabel}>Icon</Text>

              <View style={styles.iconSelectorGrid}>
                {CATEGORY_ICONS.map((item) => {
                  const isSelected = selectedIcon === item.name;

                  return (
                    <Pressable
                      key={item.name}
                      style={[
                        styles.iconOption,
                        isSelected && styles.iconOptionSelected,
                      ]}
                      onPress={() => setSelectedIcon(item.name)}
                    >
                      <Icon
                        name={item.name as any}
                        size={24}
                        color={isSelected ? WHITE : BLACK}
                      />

                      <Text
                        style={[
                          styles.iconOptionLabel,
                          isSelected && styles.iconOptionLabelSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.sectionLabel}>Color</Text>

              <View style={styles.colorSelectorRow}>
                {CATEGORY_COLORS.map((color) => {
                  const isSelected = selectedColor === color;

                  return (
                    <Pressable
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        isSelected && styles.colorOptionSelected,
                      ]}
                      onPress={() => setSelectedColor(color)}
                    />
                  );
                })}
              </View>

              <View style={styles.actions}>
                <Pressable
                  style={styles.clearButton}
                  onPress={() => {
                    resetCreateForm();
                    setMode("filter");
                  }}
                >
                  <Text style={styles.clearButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.applyButton,
                    (!categoryName.trim() || isSaving) &&
                      styles.applyButtonDisabled,
                  ]}
                  onPress={createCategory}
                >
                  <Text style={styles.applyButtonText}>
                    {isSaving ? "Saving..." : "Save"}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
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
    maxHeight: "82%",
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

  input: {
    height: 44,
    borderRadius: 16,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  sectionLabel: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: BLACK,
    marginBottom: 8,
  },

  typeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  typeButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  typeButtonSelected: {
    backgroundColor: TAB_GREEN,
    borderColor: TAB_GREEN,
  },

  typeButtonText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: BLACK,
  },

  typeButtonTextSelected: {
    color: WHITE,
  },

  iconSelectorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 16,
  },

  iconOption: {
    width: "30%",
    height: 68,
    borderRadius: 18,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: LIGTH_GRAY,
  },

  iconOptionSelected: {
    backgroundColor: DARK_GREEN,
    borderColor: DARK_GREEN,
  },

  iconOptionLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: BLACK,
  },

  iconOptionLabelSelected: {
    color: WHITE,
    fontFamily: fonts.bold,
  },

  colorSelectorRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },

  colorOptionSelected: {
    borderColor: BLACK,
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

  applyButtonDisabled: {
    opacity: 0.5,
  },

  applyButtonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: WHITE,
  },
});