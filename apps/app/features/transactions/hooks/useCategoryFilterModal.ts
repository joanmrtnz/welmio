import { useEffect, useState } from "react";
import type { Category } from "@repo/shared-types";

import {
  createCategory,
  deleteCategory,
  getCategoriesOverview,
  updateCategory,
} from "../services/categories.service";

import {
  DEFAULT_CATEGORY_COLOR,
  DEFAULT_CATEGORY_ICON,
  DEFAULT_CATEGORY_TYPE,
} from "../constants/categoryOptions";

import {
  normalizeCategoryName,
  toggleCategoryId,
} from "../utils/categoryFilter";
import { feedback } from "@/components/ui/feedback/feedback.service";

type CategoryType = "income" | "expense";
type ModalMode = "filter" | "create";

type UseCategoryFilterModalParams = {
  visible: boolean;
  selectedCategoryIds: string[];
  onClose: () => void;
  onApply: (categoryIds: string[]) => void;
};

const MAX_CATEGORY_NAME_LENGTH = 40;

export function useCategoryFilterModal({
  visible,
  selectedCategoryIds,
  onClose,
  onApply,
}: UseCategoryFilterModalParams) {
  const [mode, setMode] = useState<ModalMode>("filter");

  const [categories, setCategories] = useState<Category[]>([]);
  const [draftSelectedIds, setDraftSelectedIds] = useState<string[]>([]);

  const [categoryName, setCategoryName] = useState("");
  const [selectedType, setSelectedType] =
    useState<CategoryType>(DEFAULT_CATEGORY_TYPE);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_CATEGORY_ICON);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_CATEGORY_COLOR);

  const [isSaving, setIsSaving] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );

  const trimmedCategoryName = categoryName.trim();
  const isCategoryNameTooLong =
    trimmedCategoryName.length > MAX_CATEGORY_NAME_LENGTH;

  const canSaveCategory =
    Boolean(trimmedCategoryName) && !isCategoryNameTooLong && !isSaving;

  async function loadCategories() {
    try {
      const response = await getCategoriesOverview();
      setCategories(response.categories);
    } catch (error) {
      console.warn("[CategoryFilterModal] load categories error:", error);
    }
  }

  useEffect(() => {
    if (!visible) return;

    setMode("filter");
    setDraftSelectedIds(selectedCategoryIds);

    loadCategories();
  }, [visible, selectedCategoryIds]);

  function resetCategoryForm() {
    setCategoryName("");
    setSelectedType(DEFAULT_CATEGORY_TYPE);
    setSelectedIcon(DEFAULT_CATEGORY_ICON);
    setSelectedColor(DEFAULT_CATEGORY_COLOR);
    setEditingCategoryId(null);
  }

  function handleOpenCreateCategory() {
    resetCategoryForm();
    setMode("create");
  }

  function handleEditSelectedCategory() {
    if (draftSelectedIds.length !== 1) {
      feedback.error("Select only one category to edit");
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.id === draftSelectedIds[0],
    );

    if (!selectedCategory) {
      feedback.error("Category not found");
      return;
    }

    setEditingCategoryId(selectedCategory.id);
    setCategoryName(selectedCategory.name);
    setSelectedType(selectedCategory.type ?? DEFAULT_CATEGORY_TYPE);
    setSelectedIcon(selectedCategory.icon ?? DEFAULT_CATEGORY_ICON);
    setSelectedColor(selectedCategory.color ?? DEFAULT_CATEGORY_COLOR);
    setMode("create");
  }

  async function handleDeleteSelectedCategories() {
    if (!draftSelectedIds.length) return;

    try {
      await Promise.all(
        draftSelectedIds.map((categoryId) => deleteCategory(categoryId)),
      );

      feedback.success(
        draftSelectedIds.length === 1
          ? "Category deleted successfully"
          : "Categories deleted successfully",
      );

      setDraftSelectedIds([]);

      await loadCategories();
    } catch (error) {
      console.warn("[CategoryFilterModal] delete categories error:", error);

      const statusCode =
        error instanceof Error && "statusCode" in error
          ? error.statusCode
          : error instanceof Error && "status" in error
            ? error.status
            : null;

      if (statusCode === 409) {
        // TODO: add logic and a confirmation dialog to delete
        // all transactions associated with this category, and the category itself.
        feedback.error(
          "This category is linked to existing transactions and can't be deleted.",
        );
        return;
      }

      feedback.error("Error deleting categories");
    }
  }

  async function handleSubmitCategory() {
    const name = categoryName.trim();

    if (!name || isSaving) return;

    if (name.length > MAX_CATEGORY_NAME_LENGTH) {
      feedback.error(
        `Category name cannot be longer than ${MAX_CATEGORY_NAME_LENGTH} characters.`,
      );
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        name,
        type: selectedType,
        icon: selectedIcon,
        color: selectedColor,
      };

      if (editingCategoryId) {
        await updateCategory(editingCategoryId, payload);
        feedback.success("Category updated successfully");
      } else {
        await createCategory(payload);
        feedback.success("Category created successfully");
      }

      resetCategoryForm();
      setMode("filter");
      await loadCategories();
    } catch (error) {
      console.warn("[CategoryFilterModal] save category error:", error);
      feedback.error(
        editingCategoryId
          ? "Error updating category"
          : "Error creating category",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    setMode("filter");
    resetCategoryForm();
    onClose();
  }

  function handleBackToFilter() {
    resetCategoryForm();
    setMode("filter");
  }

  function handleToggleCategory(categoryId: string) {
    setDraftSelectedIds((prev) => toggleCategoryId(prev, categoryId));
  }

  function clearFilters() {
    setDraftSelectedIds([]);
  }

  function applyFilters() {
    onApply(draftSelectedIds);
    handleClose();
  }

  async function handleCreateCategory() {
    const trimmedName = normalizeCategoryName(categoryName);

    if (!trimmedName || isSaving) return;

    if (trimmedName.length > MAX_CATEGORY_NAME_LENGTH) {
      feedback.error(
        `Category name cannot be longer than ${MAX_CATEGORY_NAME_LENGTH} characters.`,
      );
      return;
    }

    try {
      setIsSaving(true);

      const newCategory = await createCategory({
        name: trimmedName,
        type: selectedType,
        icon: selectedIcon,
        color: selectedColor,
      });

      feedback.success("Category created successfully");

      setCategories((prev) => [...prev, newCategory]);
      setDraftSelectedIds((prev) => [...prev, newCategory.id]);

      resetCategoryForm();
      setMode("filter");
    } catch (error) {
      console.warn("[CategoryFilterModal] create category error:", error);
      feedback.error("Error submitting the category");
    } finally {
      setIsSaving(false);
    }
  }

  return {
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
    isCategoryNameTooLong,
    maxCategoryNameLength: MAX_CATEGORY_NAME_LENGTH,

    editingCategoryId,

    handleClose,
    handleBackToFilter,
    handleToggleCategory,
    clearFilters,
    applyFilters,
    handleCreateCategory,
    handleOpenCreateCategory,
    handleEditSelectedCategory,
    handleDeleteSelectedCategories,
    handleSubmitCategory,
  };
}