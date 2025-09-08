"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseData } from "../types/expense.types";
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  formatCurrency,
} from "../utils/expense.utils";
import {
  manualProfitCalculation,
  validateCalculationConsistency,
} from "../utils/verification.utils";

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
  allIncomeExpenses: (ExpenseData & { type?: string })[];
}

export function IncomeExpensesStatsCards({
  data,
  expenses,
  allIncomeExpenses,
}: IncomeExpensesStatsCardsProps) {
  if (!data) {
    return null;
  }

  // Calculate total revenue from all registrations (same as main admin stats)
  const totalRegistrationRevenue = data.reduce(
    (sum, participant) => sum + (participant.total || 0),
    0
  );

  // Calculate additional income from income entries
  const additionalIncome = calculateTotalIncome(allIncomeExpenses);

  // Calculate total revenue (registrations + additional income)
  const totalRevenue = totalRegistrationRevenue + additionalIncome;

  // Calculate total expenses and profit
  const totalExpenses = calculateTotalExpenses(expenses);
  const profit = totalRevenue - totalExpenses;

  // Debug logging to verify calculations
  console.log("=== PROFIT/LOSS CALCULATION DEBUG ===");
  console.log("Registration Revenue:", totalRegistrationRevenue);
  console.log("Additional Income from entries:", additionalIncome);
  console.log("Total Revenue:", totalRevenue);
  console.log("Total Expenses:", totalExpenses);
  console.log("Calculated Profit:", profit);
  console.log("All Income/Expense entries:", allIncomeExpenses);
  console.log("Filtered expenses only:", expenses);
  console.log("=====================================");

  // Run manual verification to double-check calculations
  const manualResult = manualProfitCalculation(data, allIncomeExpenses);

  // Validate consistency between manual and component calculations
  const calculationsMatch = validateCalculationConsistency(manualResult, {
    totalRevenue,
    totalExpenses,
    profit,
    additionalIncome,
  });

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
            {additionalIncome > 0
              ? `Registrations (${formatCurrency(
                  totalRegistrationRevenue
                )}) + Additional Income (${formatCurrency(additionalIncome)})`
              : "From all registrations"}
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
          <p className="text-xs text-muted-foreground">
            Revenue - Expenses {calculationsMatch ? "✅" : "⚠️"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
