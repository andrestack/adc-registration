"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { StatsCards } from "./components/stats-cards";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

async function getRegistrations(year: number) {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/api/registration?year=${year}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch registrations");
  }

  const data = await res.json();
  return data.data;
}

async function getIncomeExpenses(year: number) {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/api/income-expense?year=${year}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch income/expenses");
  }

  const data = await res.json();
  return data.data || [];
}

function formatCurrency(amount: number): string {
  return `€${amount.toLocaleString()}`;
}

function calculateFinancials(registrations: any[], incomeExpenses: any[]) {
  // Registration revenue
  const registrationRevenue = registrations.reduce(
    (sum: number, r: { total: number }) => sum + (r.total || 0),
    0
  );

  // Additional income from income entries
  const additionalIncome = incomeExpenses
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  // Total revenue
  const totalRevenue = registrationRevenue + additionalIncome;

  // Total expenses
  const totalExpenses = incomeExpenses
    .filter((item) => item.type !== "income")
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  // Profit/Loss
  const profit = totalRevenue - totalExpenses;

  // Net margin
  const netMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return {
    totalRevenue,
    totalExpenses,
    profit,
    netMargin,
  };
}

function calculatePercentageChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+∞" : "0%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

function getChangeIcon(current: number, previous: number) {
  if (current > previous) {
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  } else if (current < previous) {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }
  return <Minus className="h-4 w-4 text-gray-400" />;
}

export default function AdminPage() {
  const [registrations2025, setRegistrations2025] = React.useState([]);
  const [registrations2026, setRegistrations2026] = React.useState([]);
  const [incomeExpenses2025, setIncomeExpenses2025] = React.useState([]);
  const [incomeExpenses2026, setIncomeExpenses2026] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch both years for comparison
    Promise.all([
      getRegistrations(2025),
      getRegistrations(2026),
      getIncomeExpenses(2025),
      getIncomeExpenses(2026),
    ])
      .then(([regs2025, regs2026, incExp2025, incExp2026]) => {
        setRegistrations2025(regs2025);
        setRegistrations2026(regs2026);
        setIncomeExpenses2025(incExp2025);
        setIncomeExpenses2026(incExp2026);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
        setIsLoading(false);
      });
  }, []);

  // Calculate stats for comparison
  const stats2025 = {
    participants: registrations2025.length,
    totalRevenue: registrations2025.reduce((sum: number, r: { total: number }) => sum + r.total, 0),
    paidCount: registrations2025.filter((r: { paymentMade: boolean }) => r.paymentMade).length,
  };

  const stats2026 = {
    participants: registrations2026.length,
    totalRevenue: registrations2026.reduce((sum: number, r: { total: number }) => sum + r.total, 0),
    paidCount: registrations2026.filter((r: { paymentMade: boolean }) => r.paymentMade).length,
  };

  // Calculate financials
  const financials2025 = calculateFinancials(registrations2025, incomeExpenses2025);
  const financials2026 = calculateFinancials(registrations2026, incomeExpenses2026);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-semibold font-garda-empty tracking-tight">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            ADC 2026 - Current Year Overview
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold font-garda-empty tracking-tight">
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          ADC 2026 - Current Year Overview
        </p>
      </div>

      {/* Participant Comparison Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Year over Year Comparison - Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">2025</p>
              <p className="text-2xl font-bold">{stats2025.participants}</p>
              <p className="text-xs text-muted-foreground">participants</p>
              <p className="text-lg font-semibold text-green-600 mt-1">
                {formatCurrency(stats2025.totalRevenue)}
              </p>
              <p className="text-xs text-muted-foreground">revenue</p>
            </div>
            <div className="text-center border-x border-blue-200">
              <p className="text-sm text-muted-foreground mb-1">2026</p>
              <p className="text-2xl font-bold">{stats2026.participants}</p>
              <p className="text-xs text-muted-foreground">participants</p>
              <p className="text-lg font-semibold text-green-600 mt-1">
                {formatCurrency(stats2026.totalRevenue)}
              </p>
              <p className="text-xs text-muted-foreground">revenue</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Growth</p>
              <div className="flex items-center justify-center gap-1">
                {getChangeIcon(stats2026.participants, stats2025.participants)}
                <p className={`text-2xl font-bold ${stats2026.participants >= stats2025.participants ? 'text-green-600' : 'text-red-600'}`}>
                  {calculatePercentageChange(stats2026.participants, stats2025.participants)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">participants</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                {getChangeIcon(stats2026.totalRevenue, stats2025.totalRevenue)}
                <p className={`text-lg font-semibold ${stats2026.totalRevenue >= stats2025.totalRevenue ? 'text-green-600' : 'text-red-600'}`}>
                  {calculatePercentageChange(stats2026.totalRevenue, stats2025.totalRevenue)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Performance Card */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-lg">Financial Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {/* 2025 Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center border-b border-emerald-200 pb-2">2025</h3>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="font-semibold text-green-700">
                  {formatCurrency(financials2025.totalRevenue)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(financials2025.totalExpenses)}
                </span>
              </div>
              
              <div className="border-t border-emerald-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profit/Loss</span>
                  <span className={`font-bold text-lg ${financials2025.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(financials2025.profit)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Net Margin</span>
                  <span className={`text-sm font-semibold ${financials2025.netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {financials2025.netMargin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* 2026 Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center border-b border-emerald-200 pb-2">2026</h3>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="font-semibold text-green-700">
                  {formatCurrency(financials2026.totalRevenue)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(financials2026.totalExpenses)}
                </span>
              </div>
              
              <div className="border-t border-emerald-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profit/Loss</span>
                  <span className={`font-bold text-lg ${financials2026.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(financials2026.profit)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">Net Margin</span>
                  <span className={`text-sm font-semibold ${financials2026.netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {financials2026.netMargin.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="mt-6 pt-4 border-t border-emerald-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Revenue Change</p>
                <div className="flex items-center justify-center gap-1">
                  {getChangeIcon(financials2026.totalRevenue, financials2025.totalRevenue)}
                  <span className={`font-semibold ${financials2026.totalRevenue >= financials2025.totalRevenue ? 'text-green-600' : 'text-red-600'}`}>
                    {calculatePercentageChange(financials2026.totalRevenue, financials2025.totalRevenue)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expense Change</p>
                <div className="flex items-center justify-center gap-1">
                  {getChangeIcon(financials2026.totalExpenses, financials2025.totalExpenses)}
                  <span className={`font-semibold ${financials2026.totalExpenses <= financials2025.totalExpenses ? 'text-green-600' : 'text-red-600'}`}>
                    {calculatePercentageChange(financials2026.totalExpenses, financials2025.totalExpenses)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profit Change</p>
                <div className="flex items-center justify-center gap-1">
                  {getChangeIcon(financials2026.profit, financials2025.profit)}
                  <span className={`font-semibold ${financials2026.profit >= financials2025.profit ? 'text-green-600' : 'text-red-600'}`}>
                    {calculatePercentageChange(financials2026.profit, financials2025.profit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StatsCards data={registrations2026} />

      <div className="rounded-lg border shadow p-4">
        <DataTable columns={columns} data={registrations2026} />
      </div>
    </div>
  );
}
