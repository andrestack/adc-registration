"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ExpenseData } from "../types/expense.types";
import {
  getExpenseCategoryColor,
  findHighestExpense,
  sortExpensesByAmount,
  formatCurrency,
  aggregateExpensesByCategory,
} from "../utils/expense.utils";
import { ExpenseCategoryModal } from "./expense-category-modal";

interface ExpenseCategoryBadgesProps {
  expenses: ExpenseData[];
}

export function ExpenseCategoryBadges({
  expenses,
}: ExpenseCategoryBadgesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Aggregate expenses by category name to avoid duplicates
  const aggregatedExpenses = aggregateExpensesByCategory(expenses);

  // Find the biggest expense for highlighting
  const biggestExpense = findHighestExpense(aggregatedExpenses);

  const handleBadgeClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
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
                cursor-pointer hover:shadow-md
                ${isHighest ? "ring-2 ring-red-500/50" : ""}
              `}
              onClick={() => handleBadgeClick(expense.name)}
              title={`Click to view all ${expense.name} expenses`}
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

      {/* Category Detail Modal */}
      {selectedCategory && (
        <ExpenseCategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          categoryName={selectedCategory}
          expenses={expenses}
        />
      )}
    </>
  );
}
