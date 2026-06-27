import { useState } from "react";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog/ConfirmDialog";
import { t } from "@/lib/i18n";

import { CATEGORY_ICONS } from "../../constants/categoryOptions";
import { useCategoryFilterModal } from "../../hooks/useCategoryFilterModal";

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
    categories,
    draftSelectedIds,

    categoryName,
    setCategoryName,

    selectedType,
    setSelectedType,

    selectedIcon,
    setSelectedIcon,

    isSaving,
    canSaveCategory,
    isCategoryNameTooLong,
    maxCategoryNameLength,

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

  const { BLACK, RED, TAB_GREEN } = categoryFilterModalColors;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const hasSelectedCategories = draftSelectedIds.length > 0;
  const canEditSelectedCategory = draftSelectedIds.length === 1;
  const isEditingCategory = Boolean(editingCategoryId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeletingCategories, setIsDeletingCategories] = useState(false);

  const deleteDialogMessage =
    draftSelectedIds.length === 1
      ? t("transactions.categoryFilter.deleteDialog.singleMessage")
      : t("transactions.categoryFilter.deleteDialog.multipleMessage");

  const deleteDialogConfirmLabel =
    draftSelectedIds.length === 1
      ? t("transactions.categoryFilter.deleteDialog.singleConfirmLabel")
      : t("transactions.categoryFilter.deleteDialog.multipleConfirmLabel");

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
        <Pressable
          style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}
        >
          {mode === "filter" ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>
                  {t("transactions.categoryFilter.title")}
                </Text>

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
                        style={[
                          styles.gridItem,
                          isDesktop && styles.gridItemDesktop,
                        ]}
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
                  style={[
                    styles.addMoreButton,
                    isDesktop && styles.addMoreButtonDesktop,
                  ]}
                  onPress={handleOpenCreateCategory}
                >
                  <Icon name="plus" size={23} color={BLACK} />

                  <Text style={styles.addMoreText}>
                    {t("transactions.categoryFilter.addMoreCategories")}
                  </Text>
                </Pressable>
              </ScrollView>

              <View
                style={[styles.actions, isDesktop && styles.actionsDesktop]}
              >
                <Pressable style={styles.clearButton} onPress={clearFilters}>
                  <Text style={styles.clearButtonText}>
                    {t("transactions.categoryFilter.clear")}
                  </Text>
                </Pressable>

                <Pressable style={styles.applyButton} onPress={applyFilters}>
                  <Text style={styles.applyButtonText}>
                    {t("transactions.categoryFilter.applyFilter")}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>
                  {isEditingCategory
                    ? t("transactions.categoryFilter.editCategory")
                    : t("transactions.categoryFilter.newCategory")}
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
                  placeholder={t(
                    "transactions.categoryFilter.categoryNamePlaceholder",
                  )}
                  placeholderTextColor="rgba(5, 46, 43, 0.45)"
                  style={styles.input}
                />

                {isCategoryNameTooLong && (
                  <Text style={styles.validationWarningLabel}>
                    {t("transactions.categoryFilter.categoryNameMaxLengthStart")}{" "}
                    {maxCategoryNameLength}{" "}
                    {t("transactions.categoryFilter.categoryNameMaxLengthEnd")}
                  </Text>
                )}

                <Text style={styles.sectionLabel}>
                  {t("transactions.categoryFilter.type")}
                </Text>

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
                      {t("transactions.types.income")}
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
                      {t("transactions.types.expense")}
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.sectionLabel}>
                  {t("transactions.categoryFilter.icon")}
                </Text>

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

                {/* <Text style={styles.sectionLabel}>Color</Text>

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
                </View> */}
              </ScrollView>

              <View
                style={[styles.actions, isDesktop && styles.actionsDesktop]}
              >
                <Pressable
                  style={styles.clearButton}
                  onPress={handleBackToFilter}
                >
                  <Text style={styles.clearButtonText}>
                    {t("transactions.categoryFilter.cancel")}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.applyButton,
                    !canSaveCategory && styles.applyButtonDisabled,
                  ]}
                  onPress={handleSubmitCategory}
                  disabled={!canSaveCategory || isSaving}
                >
                  <Text style={styles.applyButtonText}>
                    {isSaving
                      ? t("transactions.categoryFilter.saving")
                      : isEditingCategory
                        ? t("transactions.categoryFilter.saveChanges")
                        : t("transactions.categoryFilter.save")}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </Pressable>

        <ConfirmDialog
          visible={showDeleteDialog}
          title={t("transactions.categoryFilter.deleteDialog.title")}
          message={deleteDialogMessage}
          confirmLabel={deleteDialogConfirmLabel}
          cancelLabel={t("transactions.categoryFilter.deleteDialog.cancelLabel")}
          loadingLabel={t("transactions.categoryFilter.deleteDialog.loadingLabel")}
          destructive
          isLoading={isDeletingCategories}
          onConfirm={handleConfirmDeleteCategories}
          onCancel={handleCloseDeleteDialog}
        />
      </Pressable>
    </Modal>
  );
}