import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { Icon } from "@/components/icons/Icon";

import { useCategoryFilterModal } from "../../hooks/useCategoryFilterModal";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from "../../constants/categoryOptions";

import {
  categoryFilterModalColors,
  styles,
} from "./categoryFilterModal.styles";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog/ConfirmDialog";

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

    editingCategoryId,

    handleClose,
    handleBackToFilter,
    handleToggleCategory,
    clearFilters,
    applyFilters,

    handleOpenCreateCategory,
    handleEditSelectedCategory,
    handleDeleteSelectedCategories,
    handleSubmitCategory,
  } = useCategoryFilterModal({
    visible,
    selectedCategoryIds,
    onClose,
    onApply,
  });

  const { BLACK, WHITE, RED, TAB_GREEN } = categoryFilterModalColors;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const hasSelectedCategories = draftSelectedIds.length > 0;
  const canEditSelectedCategory = draftSelectedIds.length === 1;
  const isEditingCategory = Boolean(editingCategoryId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeletingCategories, setIsDeletingCategories] = useState(false);


  function handleOpenDeleteDialog() {
    setShowDeleteDialog(true);
  }

  function handleCloseDeleteDialog() {
    if (isDeletingCategories) return;

    setShowDeleteDialog(false);
  }

  async function handleConfirmDeleteCategories() {
    try {
      setIsDeletingCategories(true);

      await handleDeleteSelectedCategories();

      setShowDeleteDialog(false);
    } catch (error) {
      console.warn("[CategoryFilterModal] delete categories error:", error);
    } finally {
      setIsDeletingCategories(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        style={[styles.backdrop, isDesktop && styles.backdropDesktop]}
        onPress={handleClose}
      >
        <Pressable style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}>
          {mode === "filter" ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Filter by category</Text>

                <View style={styles.headerActions}>
                  {hasSelectedCategories && (
                    <>
                      {canEditSelectedCategory && (
                        <Pressable
                          onPress={handleEditSelectedCategory}
                          style={styles.headerIconButton}
                        >
                          <Icon
                            name="edit"
                            size={17}
                            strokeWidth={1.6}
                            color={BLACK}
                          />
                        </Pressable>
                      )}

                     <Pressable
                        onPress={handleOpenDeleteDialog}
                        style={[
                          styles.headerIconButton,
                          styles.deleteIconButton,
                        ]}
                        disabled={isDeletingCategories}
                      >
                        <Icon
                          name="bin"
                          size={21}
                          strokeWidth={1.6}
                          color={RED}
                        />
                      </Pressable>
                    </>
                  )}

                  <Pressable onPress={handleClose} style={styles.closeButton}>
                    <Icon name="close" size={15} color={BLACK} />
                  </Pressable>
                </View>
              </View>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                  styles.scrollContent,
                  isDesktop && styles.scrollContentDesktop,
                ]}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.grid, isDesktop && styles.gridDesktop]}>
                  {categories.map((item) => {
                    const isSelected = draftSelectedIds.includes(item.id);

                    return (
                      <Pressable
                        key={item.id}
                        style={[styles.gridItem, isDesktop && styles.gridItemDesktop]}
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
                            size={40}
                            strokeWidth={1}
                            color={TAB_GREEN}
                          />
                        </View>

                        <Text
                          style={[
                            styles.gridLabel,
                            isSelected && styles.gridLabelSelected,
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  style={[styles.addMoreButton, isDesktop && styles.addMoreButtonDesktop]}
                  onPress={handleOpenCreateCategory}
                >
                  <Icon name="plus" size={23} color={BLACK} />
                  <Text style={styles.addMoreText}>Add more categories</Text>
                </Pressable>
              </ScrollView>

              <View style={[styles.actions, isDesktop && styles.actionsDesktop]}>
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
                <Text style={styles.title}>
                  {isEditingCategory ? "Edit Category" : "New Category"}
                </Text>

                <Pressable
                  onPress={handleBackToFilter}
                  style={styles.closeButton}
                >
                  <Icon name="close" size={15} color={BLACK} />
                </Pressable>
              </View>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                  styles.scrollContent,
                  isDesktop && styles.formScrollContentDesktop,
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
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
                          size={38}
                          strokeWidth={1}
                          color={isSelected ? TAB_GREEN : BLACK}
                        />
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
              </ScrollView>

              <View style={[styles.actions, isDesktop && styles.actionsDesktop]}>
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
                  onPress={handleSubmitCategory}
                >
                  <Text style={styles.applyButtonText}>
                    {isSaving
                      ? "Saving..."
                      : isEditingCategory
                        ? "Save changes"
                        : "Save"}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </Pressable>
        <ConfirmDialog
          visible={showDeleteDialog}
          title="Delete Category"
          message={`Are you sure you want to delete ${
            draftSelectedIds.length === 1 ? "this category" : "these categories"
          }?
          This action cannot be undone.`}
          confirmLabel={
            draftSelectedIds.length === 1 ? "Yes, Delete" : "Yes, Delete All"
          }
          cancelLabel="Cancel"
          loadingLabel="Deleting..."
          destructive
          isLoading={isDeletingCategories}
          onConfirm={handleConfirmDeleteCategories}
          onCancel={handleCloseDeleteDialog}
        />
      </Pressable>
    </Modal>
  );
}