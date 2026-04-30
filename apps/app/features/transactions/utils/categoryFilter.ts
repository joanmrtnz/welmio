export function toggleCategoryId(
  selectedIds: string[],
  categoryId: string,
): string[] {
  return selectedIds.includes(categoryId)
    ? selectedIds.filter((id) => id !== categoryId)
    : [...selectedIds, categoryId];
}

export function normalizeCategoryName(name: string) {
  return name.trim();
}