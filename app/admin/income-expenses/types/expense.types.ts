// Shared types for expense management system

export interface ExpenseData {
  id?: string; // For future database ID
  name: string;
  amount: number;
  description?: string;
  category?: string; // For potential subcategories
  dateCreated?: Date | string;
  dateUpdated?: Date | string;
  createdBy?: string; // For audit trail
  updatedBy?: string; // For audit trail
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
  isActive: boolean;
}

// For form submission and validation
export interface ExpenseFormData {
  name: string;
  amount: number;
  description?: string;
  category?: string;
}

// For income and expense form submissions
export interface IncomeExpenseFormData extends ExpenseFormData {
  type: "income" | "expense";
}

// For API responses
export interface ExpenseAPIResponse {
  success: boolean;
  data: ExpenseData[];
  message?: string;
  error?: string;
}

// Color mapping type for better type safety
export type ExpenseColorMap = {
  [key: string]: string;
};

// Default expense categories with colors
export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: "artist-fees",
    name: "Artist Fees",
    color:
      "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
    description: "Payment to performing artists",
    isActive: true,
  },
  {
    id: "travels",
    name: "Travels",
    color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    description: "Transportation and accommodation",
    isActive: true,
  },
  {
    id: "team",
    name: "Team",
    color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    description: "Staff and support team compensation",
    isActive: true,
  },
  {
    id: "supermarket",
    name: "Supermarket",
    color:
      "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
    description: "Food and supplies",
    isActive: true,
  },
  {
    id: "bar",
    name: "Bar",
    color: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
    description: "Beverages and bar supplies",
    isActive: true,
  },
];

// Default fallback color
export const DEFAULT_EXPENSE_COLOR =
  "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
