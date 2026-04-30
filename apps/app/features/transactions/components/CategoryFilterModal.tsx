import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { Icon } from "@/components/icons/Icon";

import { useCategoryFilterModal } from "../hooks/useCategoryFilterModal";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from "../constants/categoryOptions";

import {
  categoryFilterModalColors,
  styles,
} from "./categoryFilterModal.styles";

type CategoryFilterModalProps = {
  visible: boolean;
  selectedCategoryIds: string[];
  onClose: () => void;
  onApply: (categoryIds: string[]) => void;
};

export function CategoryFilterModal({
  visible,
  selectedCategoryIds,
  onClose,
  onApply,
}: CategoryFilterModalProps) {
  const {
    mode,
    setMode,

    categories,
    draftSelectedIds,

    categoryName,
    setCategoryName,

    selectedType,
    setSelectedType,

    selectedIcon,
    setSelectedIcon,

    selectedColor,
    setSelectedColor,

    isSaving,
    canSaveCategory,

    handleClose,
    handleBackToFilter,
    handleToggleCategory,
    clearFilters,
    applyFilters,
    handleCreateCategory,
  } = useCategoryFilterModal({
    visible,
    selectedCategoryIds,
    onClose,
    onApply,
  });

  const { BLACK, WHITE } = categoryFilterModalColors;

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
                      onPress={() => handleToggleCategory(item.id)}
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
                  onPress={handleBackToFilter}
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
                  onPress={handleBackToFilter}
                >
                  <Text style={styles.clearButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.applyButton,
                    !canSaveCategory && styles.applyButtonDisabled,
                  ]}
                  onPress={handleCreateCategory}
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