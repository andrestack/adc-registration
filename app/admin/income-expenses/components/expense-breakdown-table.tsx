"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  findHighestExpense,
  sortExpensesByAmount,
  calculateTotalExpenses,
  calculateExpensePercentage,
  formatCurrency,
} from "../utils/expense.utils";

interface ExpenseBreakdownTableProps {
  expenses: ExpenseData[];
}

export function ExpenseBreakdownTable({
  expenses,
}: ExpenseBreakdownTableProps) {
  // Find the biggest expense for highlighting
  const biggestExpense = findHighestExpense(expenses);

  // Calculate total expenses
  const totalExpenses = calculateTotalExpenses(expenses);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Short Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">% of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortExpensesByAmount(expenses).map((expense) => {
              const percentage = calculateExpensePercentage(
                expense.amount,
                totalExpenses
              );
              const isHighest =
                biggestExpense && expense.name === biggestExpense.name;

              return (
                <TableRow key={expense.id || expense.name}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getExpenseCategoryColor(expense.name)}
                    >
                      {expense.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {expense.description || "No description available"}
                  </TableCell>
                  <TableCell
                    className={`text-right font-mono ${
                      isHighest ? "font-bold text-red-600" : ""
                    }`}
                  >
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {percentage}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
