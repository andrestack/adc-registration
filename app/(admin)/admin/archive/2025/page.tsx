"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { DataTable } from "@/app/admin/components/data-table";
import { columns as registrationColumns, Registration } from "@/app/admin/components/columns";
import { StatsCards } from "@/app/admin/components/stats-cards";
import { FoodStatsCards } from "@/app/admin/food/components/food-stats-cards";
import { AccommodationStatsCards } from "@/app/admin/accommodation/components/accommodation-stats-cards";
import { IncomeExpensesStatsCards } from "@/app/admin/income-expenses/components/income-expenses-stats-cards";
import { ExpenseCategoryBadges } from "@/app/admin/income-expenses/components/expense-category-badges";
import { ExpenseData } from "@/app/admin/income-expenses/types/expense.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from "lucide-react";

interface FinancialSummaryProps {
  registrations: Registration[];
  allIncomeExpenses: ExpenseData[];
  expenses: ExpenseData[];
}

function FinancialSummary({ registrations, allIncomeExpenses, expenses }: FinancialSummaryProps) {
  // Calculate registration revenue
  const registrationRevenue = registrations.reduce(
    (sum, r) => sum + (r.total || 0),
    0
  );

  // Calculate additional income
  const additionalIncome = allIncomeExpenses
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  // Total revenue
  const totalRevenue = registrationRevenue + additionalIncome;

  // Total expenses
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Profit/Loss
  const profit = totalRevenue - totalExpenses;

  // Net margin
  const netMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  const formatCurrency = (amount: number) => `€${amount.toLocaleString()}`;

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          2025 Financial Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {registrations.length} registrations
              {additionalIncome > 0 && ` + ${formatCurrency(additionalIncome)} income`}
            </p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.length} expense entries
            </p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow-sm border-2 border-slate-200">
            <p className="text-sm text-muted-foreground mb-1">Net Profit/Loss</p>
            <div className="flex items-center justify-center gap-2">
              {profit >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(profit))}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {profit >= 0 ? 'Profit' : 'Loss'}
            </p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Net Margin</p>
            <p className={`text-2xl font-bold ${netMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netMargin.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Profit / Revenue
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Archive2025Page() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [allIncomeExpenses, setAllIncomeExpenses] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_API_URL;

        // Fetch 2025 registrations
        const registrationsRes = await fetch(
          `${baseUrl}/api/registration?year=2025`,
          {
            cache: "no-store",
          }
        );

        if (registrationsRes.ok) {
          const registrationsData = await registrationsRes.json();
          setRegistrations(registrationsData.data || []);
        }

        // Fetch 2025 income and expenses
        const incomeExpensesRes = await fetch(
          `${baseUrl}/api/income-expense?year=2025`,
          {
            cache: "no-store",
          }
        );

        if (incomeExpensesRes.ok) {
          const incomeExpensesData = await incomeExpensesRes.json();
          const allData = incomeExpensesData.data || [];
          setAllIncomeExpenses(allData);

          // Filter only expenses for the expenses state
          const expensesOnly = allData.filter(
            (item: ExpenseData & { type?: string }) => item.type !== "income"
          );
          setExpenses(expensesOnly);
        }
      } catch (error) {
        console.error("Failed to fetch 2025 data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter food participants (exclude 'none' type)
  const foodParticipants = registrations.filter(
    (r) => r.food && r.food.type !== "none"
  );

  // Filter accommodation participants (exclude 'already-booked' type)
  const accommodationParticipants = registrations.filter(
    (r) => r.accommodation && r.accommodation.type !== "already-booked"
  );

  // Workshop participants helper
  const getWorkshopParticipants = (workshopId: string, level?: string) => {
    return registrations.filter((participant) =>
      participant.workshops?.some(
        (workshop) =>
          workshop.id === workshopId &&
          (!level || workshop.level === level)
      )
    );
  };

  const djembeParticipants = getWorkshopParticipants("djembe");
  const djembeIntermediate = getWorkshopParticipants("djembe", "intermediate");
  const djembeAdvanced = getWorkshopParticipants("djembe", "advanced");
  const danceParticipants = getWorkshopParticipants("dance");
  const balafonParticipants = getWorkshopParticipants("balafon");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-semibold font-garda-empty tracking-tight">
            ADC 2025 Archive
          </h2>
          <p className="text-muted-foreground">
            Historical data from Aldeia Djembe Camp 2025
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </div>
    );
  }

  // Check if data is empty (migration might not have been run)
  const hasData = registrations.length > 0 || allIncomeExpenses.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold font-garda-empty tracking-tight">
          ADC 2025 Archive
        </h2>
        <p className="text-muted-foreground">
          Historical data from Aldeia Djembe Camp 2025 (Read-only)
        </p>
      </div>

      {!hasData && !isLoading && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900">No 2025 Data Found</h3>
                <p className="text-sm text-amber-800 mt-1">
                  The 2025 archive appears to be empty. This usually means the database migration hasn&apos;t been run yet.
                </p>
                <div className="mt-3 p-3 bg-white rounded border border-amber-200">
                  <p className="text-xs font-mono text-amber-900">
                    <strong>To fix this:</strong>
                  </p>
                  <p className="text-xs text-amber-800 mt-1">
                    Run the migration script to tag existing 2025 data:
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                    mongosh &quot;your-connection-string&quot; &lt; scripts/migrate-to-2025.js
                  </code>
                  <p className="text-xs text-amber-700 mt-2">
                    Or manually run these MongoDB commands:
                  </p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                    db.Registrations.updateMany(&#123;&#125;, &#123; $set: &#123; year: 2025 &#125; &#125;)
                  </code>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                    db.IncomeExpenses.updateMany(&#123;&#125;, &#123; $set: &#123; year: 2025 &#125; &#125;)
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <StatsCards data={registrations} />
          <Card>
            <CardHeader>
              <CardTitle>All Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={registrationColumns} data={registrations} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accommodation Tab */}
        <TabsContent value="accommodation" className="space-y-4">
          <AccommodationStatsCards data={registrations} />
          <Card>
            <CardHeader>
              <CardTitle>Accommodation Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Nights</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accommodationParticipants.map((p) => (
                      <TableRow key={p._id}>
                        <TableCell>{p.fullName}</TableCell>
                        <TableCell>{p.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{p.accommodation.type}</Badge>
                        </TableCell>
                        <TableCell>{p.accommodation.nights}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Food Tab */}
        <TabsContent value="food" className="space-y-4">
          <FoodStatsCards data={registrations} />
          <Card>
            <CardHeader>
              <CardTitle>Food Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foodParticipants.map((p) => (
                      <TableRow key={p._id}>
                        <TableCell>{p.fullName}</TableCell>
                        <TableCell>{p.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{p.food.type}</Badge>
                        </TableCell>
                        <TableCell>{p.food.days}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workshops Tab */}
        <TabsContent value="workshops" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Djembe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">
                    Total: {djembeParticipants.length} participants
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Intermediate: {djembeIntermediate.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Advanced: {djembeAdvanced.length}
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {djembeParticipants.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{p.fullName}</TableCell>
                        <TableCell>
                          {p.workshops?.find((w) => w.id === "djembe")?.level || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Total: {danceParticipants.length} participants
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {danceParticipants.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{p.fullName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Balafon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Total: {balafonParticipants.length} participants
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balafonParticipants.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{p.fullName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Finances Tab */}
        <TabsContent value="finances" className="space-y-4">
          {/* Profit/Loss Summary Card */}
          <FinancialSummary registrations={registrations} allIncomeExpenses={allIncomeExpenses} expenses={expenses} />
          
          <IncomeExpensesStatsCards
            data={registrations}
            expenses={expenses}
            allIncomeExpenses={allIncomeExpenses}
          />
          <ExpenseCategoryBadges expenses={expenses} />
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id || expense._id || expense.name}>
                        <TableCell>
                          <Badge variant="outline">{expense.name}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {expense.description || "No description"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          €{expense.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
