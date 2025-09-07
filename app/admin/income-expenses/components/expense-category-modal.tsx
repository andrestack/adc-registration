"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseData } from "../types/expense.types";
import {
  getExpenseCategoryColor,
  formatCurrency,
} from "../utils/expense.utils";

interface ExpenseCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  expenses: ExpenseData[];
}

export function ExpenseCategoryModal({
  isOpen,
  onClose,
  categoryName,
  expenses,
}: ExpenseCategoryModalProps) {
  // Filter expenses for the selected category
  const categoryExpenses = expenses.filter(
    (expense) => expense.name === categoryName
  );

  // Calculate total for this category
  const categoryTotal = categoryExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`${getExpenseCategoryColor(categoryName)} text-sm`}
            >
              {categoryName}
            </Badge>
            <span className="text-lg">Category Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Expenses in Category
              </span>
              <span className="text-lg font-bold">
                {formatCurrency(categoryTotal)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">
                Number of Entries
              </span>
              <span className="text-sm font-medium">
                {categoryExpenses.length}{" "}
                {categoryExpenses.length === 1 ? "entry" : "entries"}
              </span>
            </div>
          </div>

          {/* Expenses Table */}
          {categoryExpenses.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryExpenses
                    .sort((a, b) => {
                      // Sort by date (newest first), fallback to amount (highest first)
                      const dateA = new Date(
                        a.dateCreated || a.dateUpdated || 0
                      );
                      const dateB = new Date(
                        b.dateCreated || b.dateUpdated || 0
                      );
                      return (
                        dateB.getTime() - dateA.getTime() || b.amount - a.amount
                      );
                    })
                    .map((expense, index) => (
                      <TableRow
                        key={
                          expense.id ||
                          expense._id ||
                          `${expense.name}-${index}`
                        }
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-sm">
                              {expense.description ||
                                "No description available"}
                            </div>
                            {expense.id || expense._id ? (
                              <div className="text-xs text-muted-foreground font-mono">
                                ID: {expense.id || expense._id}
                              </div>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {expense.dateCreated || expense.dateUpdated
                            ? new Date(
                                expense.dateCreated || expense.dateUpdated!
                              ).toLocaleDateString()
                            : "Unknown"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No expenses found for this category.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
