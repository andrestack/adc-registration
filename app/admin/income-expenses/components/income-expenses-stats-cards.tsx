"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseData } from "../types/expense.types";
import { calculateTotalExpenses, formatCurrency } from "../utils/expense.utils";

interface Participant {
  _id?: string;
  fullName: string;
  email: string;
  total: number;
  paymentMade?: boolean;
}

interface IncomeExpensesStatsCardsProps {
  data: Participant[];
  expenses: ExpenseData[];
}

export function IncomeExpensesStatsCards({
  data,
  expenses,
}: IncomeExpensesStatsCardsProps) {
  if (!data) {
    return null;
  }

  // Calculate total revenue from all registrations (same as main admin stats)
  const totalRevenue = data.reduce(
    (sum, participant) => sum + (participant.total || 0),
    0
  );

  // Calculate total expenses and profit
  const totalExpenses = calculateTotalExpenses(expenses);
  const profit = totalRevenue - totalExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Revenue Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            From all registrations
          </p>
        </CardContent>
      </Card>

      {/* Total Expenses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">
            All expense categories
          </p>
        </CardContent>
      </Card>

      {/* Profit Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              profit > 0 ? "text-green-600" : profit < 0 ? "text-red-600" : ""
            }`}
          >
            {formatCurrency(profit)}
          </div>
          <p className="text-xs text-muted-foreground">Revenue - Expenses</p>
        </CardContent>
      </Card>
    </div>
  );
}
