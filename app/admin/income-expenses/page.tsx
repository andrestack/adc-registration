"use client";

import { IncomeExpensesStatsCards } from "./components/income-expenses-stats-cards";
import { ExpenseBreakdownTable } from "./components/expense-breakdown-table";
import { ExpenseCategoryBadges } from "./components/expense-category-badges";
import { ExpenseIncomeForm } from "./components/expense-income-form";
import { ExpenseData } from "./types/expense.types";
import { useEffect, useState } from "react";

interface Participant {
  _id?: string;
  fullName: string;
  email: string;
  total: number;
  paymentMade?: boolean;
  workshops?: Array<{ id: string; level?: string }>;
  accommodation?: {
    type:
      | "tent"
      | "family-room"
      | "single-room"
      | "bungalow"
      | "already-booked";
    nights: number;
  };
  food?: { type: string; days: number };
}

export default function AdminIncomeExpensesPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<ExpenseData[]>([
    {
      name: "Artist Fees",
      amount: 12000,
      description: "Payment to performing artists",
    },
    {
      name: "Travels",
      amount: 3500,
      description: "Transportation and accommodation",
    },
    {
      name: "Team",
      amount: 8000,
      description: "Staff and support team compensation",
    },
    { name: "Supermarket", amount: 4200, description: "Food and supplies" },
    { name: "Bar", amount: 1800, description: "Beverages and bar supplies" },
  ]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setIsLoading(true);
      try {
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${baseUrl}/api/registration`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch registrations: ${res.statusText}`);
        }

        const responseData = await res.json();
        const allRegistrations = responseData.data as Participant[];

        if (!Array.isArray(allRegistrations)) {
          console.error("Fetched data.data is not an array:", allRegistrations);
          throw new Error("Invalid data format from API");
        }

        setParticipants(allRegistrations);
      } catch (error) {
        console.error("Failed to fetch registrations:", error);
        setParticipants([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const handleFormSubmit = (
    data: ExpenseData & { type: "income" | "expense" }
  ) => {
    console.log("Form submitted:", data);

    // Add the new expense/income to the list
    const newExpense: ExpenseData = {
      id: data.id,
      name: data.name,
      amount: data.amount,
      description: data.description,
      dateCreated: data.dateCreated,
    };

    setExpenses((prev) => [...prev, newExpense]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Income & Expenses
        </h2>
        <p className="text-muted-foreground">
          Financial overview of registrations, revenue, and expenses.
        </p>
      </div>

      <IncomeExpensesStatsCards data={participants} expenses={expenses} />

      <ExpenseCategoryBadges expenses={expenses} />

      {/* Split layout: Form on left, Table on right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="order-2 lg:order-1">
          <ExpenseIncomeForm onSubmit={handleFormSubmit} />
        </div>
        <div className="order-1 lg:order-2">
          <ExpenseBreakdownTable expenses={expenses} />
        </div>
      </div>
    </div>
  );
}
