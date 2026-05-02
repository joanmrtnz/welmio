import { useEffect, useState } from "react";
import type { Category } from "@repo/shared-types";

import {
  createCategory,
  getCategoriesOverview,
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

  const canSaveCategory = Boolean(categoryName.trim()) && !isSaving;

  useEffect(() => {
    if (!visible) return;

    setMode("filter");
    setDraftSelectedIds(selectedCategoryIds);

    async function loadCategories() {
      try {
        const response = await getCategoriesOverview();
        setCategories(response.categories);
      } catch (error) {
        console.warn("[CategoryFilterModal] load categories error:", error);
      }
    }

    loadCategories();
  }, [visible, selectedCategoryIds]);

  function resetCreateForm() {
    setCategoryName("");
    setSelectedType(DEFAULT_CATEGORY_TYPE);
    setSelectedIcon(DEFAULT_CATEGORY_ICON);
    setSelectedColor(DEFAULT_CATEGORY_COLOR);
  }

  function handleClose() {
    setMode("filter");
    resetCreateForm();
    onClose();
  }

  function handleBackToFilter() {
    resetCreateForm();
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

      resetCreateForm();
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

    handleClose,
    handleBackToFilter,
    handleToggleCategory,
    clearFilters,
    applyFilters,
    handleCreateCategory,
  };
}