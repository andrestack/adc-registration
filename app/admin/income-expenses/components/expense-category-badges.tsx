"use client";

import { Badge } from "@/components/ui/badge";
import { ExpenseData } from "../types/expense.types";
import {
  getExpenseCategoryColor,
  findHighestExpense,
  sortExpensesByAmount,
  formatCurrency,
  aggregateExpensesByCategory,
} from "../utils/expense.utils";

interface ExpenseCategoryBadgesProps {
  expenses: ExpenseData[];
}

export function ExpenseCategoryBadges({
  expenses,
}: ExpenseCategoryBadgesProps) {
  // Aggregate expenses by category name to avoid duplicates
  const aggregatedExpenses = aggregateExpensesByCategory(expenses);

  // Find the biggest expense for highlighting
  const biggestExpense = findHighestExpense(aggregatedExpenses);

  return (
    <div className="flex flex-wrap gap-3">
      {sortExpensesByAmount(aggregatedExpenses).map((expense) => {
        const isHighest =
          biggestExpense && expense.name === biggestExpense.name;

        return (
          <Badge
            key={expense.name}
            variant="outline"
            className={`
              ${getExpenseCategoryColor(expense.name)}
              px-3 py-2 text-sm font-medium
              flex items-center gap-2
              transition-colors duration-200
              ${isHighest ? "ring-2 ring-red-500/50" : ""}
            `}
          >
            <span>{expense.name}</span>
            <span
              className={`font-mono font-bold ${
                isHighest ? "text-red-700" : ""
              }`}
            >
              {formatCurrency(expense.amount)}
            </span>
          </Badge>
        );
      })}
    </div>
  );
}
