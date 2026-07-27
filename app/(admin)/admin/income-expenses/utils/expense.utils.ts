import {
  ExpenseData,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_EXPENSE_COLOR,
} from "../types/expense.types";

/**
 * Get color class for an expense category
 */
export function getExpenseCategoryColor(categoryName: string): string {
  const category = DEFAULT_EXPENSE_CATEGORIES.find(
    (cat) => cat.name === categoryName && cat.isActive
  );
  return category?.color || DEFAULT_EXPENSE_COLOR;
}

/**
 * Calculate total expenses amount
 * Filters out any income entries to ensure only expenses are calculated
 */
export function calculateTotalExpenses(expenses: ExpenseData[]): number {
  // Filter out any income entries that might have slipped through
  const expenseOnlyData = expenses.filter(
    (item: ExpenseData & { type?: string }) => item.type !== "income"
  );
  const total = expenseOnlyData.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );

  console.log("calculateTotalExpenses - Input data:", expenses);
  console.log(
    "calculateTotalExpenses - Filtered expense entries:",
    expenseOnlyData
  );
  console.log("calculateTotalExpenses - Total expenses:", total);

  return total;
}

/**
 * Find the highest expense
 * Filters out any income entries to ensure only expenses are considered
 */
export function findHighestExpense(
  expenses: ExpenseData[]
): ExpenseData | null {
  // Filter out any income entries that might have slipped through
  const expenseOnlyData = expenses.filter(
    (item: ExpenseData & { type?: string }) => item.type !== "income"
  );
  if (expenseOnlyData.length === 0) return null;
  return expenseOnlyData.reduce((max, expense) =>
    expense.amount > max.amount ? expense : max
  );
}

/**
 * Calculate expense percentage of total
 */
export function calculateExpensePercentage(
  expenseAmount: number,
  totalExpenses: number
): string {
  if (totalExpenses === 0) return "0.0";
  return ((expenseAmount / totalExpenses) * 100).toFixed(1);
}

/**
 * Sort expenses by amount (descending)
 * Filters out any income entries to ensure only expenses are sorted
 */
export function sortExpensesByAmount(expenses: ExpenseData[]): ExpenseData[] {
  // Filter out any income entries that might have slipped through
  const expenseOnlyData = expenses.filter(
    (item: ExpenseData & { type?: string }) => item.type !== "income"
  );
  return [...expenseOnlyData].sort((a, b) => (b.amount || 0) - (a.amount || 0));
}

/**
 * Validate expense data
 */
export function validateExpenseData(expense: Partial<ExpenseData>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!expense.name || expense.name.trim().length === 0) {
    errors.push("Expense name is required");
  }

  if (typeof expense.amount !== "number" || expense.amount < 0) {
    errors.push("Amount must be a valid positive number");
  }

  if (expense.name && expense.name.length > 100) {
    errors.push("Expense name must be less than 100 characters");
  }

  if (expense.description && expense.description.length > 500) {
    errors.push("Description must be less than 500 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return `€${amount.toLocaleString()}`;
}

/**
 * Safe number parsing for form inputs
 */
export function parseExpenseAmount(value: string): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

/**
 * Calculate total income amount from income entries
 */
export function calculateTotalIncome(
  incomeExpenses: (ExpenseData & { type?: string })[]
): number {
  // Filter only income entries
  const incomeOnlyData = incomeExpenses.filter(
    (item) => item.type === "income"
  );
  const total = incomeOnlyData.reduce(
    (sum, income) => sum + (income.amount || 0),
    0
  );

  console.log("calculateTotalIncome - Input data:", incomeExpenses);
  console.log(
    "calculateTotalIncome - Filtered income entries:",
    incomeOnlyData
  );
  console.log("calculateTotalIncome - Total income:", total);

  return total;
}

/**
 * Aggregate expenses by category name, summing amounts
 * Filters out any income entries to ensure only expenses are aggregated
 */
export function aggregateExpensesByCategory(
  expenses: ExpenseData[]
): ExpenseData[] {
  const aggregated = new Map<string, ExpenseData>();

  // Filter out any income entries that might have slipped through
  const expenseOnlyData = expenses.filter(
    (item: ExpenseData & { type?: string }) => item.type !== "income"
  );

  expenseOnlyData.forEach((expense) => {
    const categoryName = expense.name;

    if (aggregated.has(categoryName)) {
      const existing = aggregated.get(categoryName)!;
      aggregated.set(categoryName, {
        ...existing,
        amount: existing.amount + expense.amount,
        // Keep the most recent description if available
        description: expense.description || existing.description,
        // Keep the most recent dateUpdated
        dateUpdated: expense.dateUpdated || existing.dateUpdated,
      });
    } else {
      aggregated.set(categoryName, { ...expense });
    }
  });

  return Array.from(aggregated.values());
}
