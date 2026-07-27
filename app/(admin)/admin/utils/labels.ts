// PT display labels for enum values stored in MongoDB.
// Database values stay in English (they are data); these maps are display-only.

export const ACCOMMODATION_TYPE_LABELS: Record<string, string> = {
  tent: "Tenda/Van",
  "family-room": "Quarto Família",
  "single-room": "Quarto Individual",
  bungalow: "Bungalow Completo",
  "already-booked": "Já tem alojamento",
};

export const FOOD_TYPE_LABELS: Record<string, string> = {
  full: "3x Refeições",
  single: "1x Refeição",
  none: "Sem refeições",
};

export const WORKSHOP_LABELS: Record<string, string> = {
  djembe: "Djembe",
  dance: "Dança",
  balafon: "Balafon",
  kora: "Kora",
};

export const WORKSHOP_LEVEL_LABELS: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermédio",
  advanced: "Avançado",
};

// Expense category names are stored on expense documents and matched by
// string, so they must stay as-is in the DB. Map the 5 defaults for display;
// user-created categories display their raw name.
export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  "Artist Fees": "Cachets de Artistas",
  Travels: "Viagens",
  Team: "Equipa",
  Supermarket: "Supermercado",
  Bar: "Bar",
};

export function getAccommodationTypeLabel(type: string): string {
  return ACCOMMODATION_TYPE_LABELS[type] ?? type;
}

export function getFoodTypeLabel(type: string): string {
  return FOOD_TYPE_LABELS[type] ?? type;
}

export function getWorkshopLabel(id: string): string {
  return WORKSHOP_LABELS[id] ?? id;
}

export function getWorkshopLevelLabel(id: string): string {
  return WORKSHOP_LEVEL_LABELS[id] ?? id;
}

export function getExpenseCategoryLabel(name: string): string {
  return EXPENSE_CATEGORY_LABELS[name] ?? name;
}
