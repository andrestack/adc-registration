/**
 * Verification utilities for profit/loss calculations
 * These functions help validate that our calculations are correct
 */

import { ExpenseData } from "../types/expense.types";

interface Participant {
  _id?: string;
  fullName: string;
  email: string;
  total: number;
  paymentMade?: boolean;
}

export function manualProfitCalculation(
  participants: Participant[],
  allIncomeExpenses: (ExpenseData & { type?: string })[]
) {
  console.log("\n🔍 MANUAL PROFIT VERIFICATION");
  console.log("================================");

  // 1. Calculate registration revenue
  const registrationRevenue = participants.reduce(
    (sum, participant) => sum + (participant.total || 0),
    0
  );
  console.log(
    `📊 Registration Revenue: €${registrationRevenue.toLocaleString()}`
  );
  console.log(`   - From ${participants.length} participants`);

  // 2. Separate and calculate income entries
  const incomeEntries = allIncomeExpenses.filter(
    (item) => item.type === "income"
  );
  const additionalIncome = incomeEntries.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  console.log(`💰 Additional Income: €${additionalIncome.toLocaleString()}`);
  console.log(`   - From ${incomeEntries.length} income entries:`);
  incomeEntries.forEach((income) => {
    console.log(`     • ${income.name}: €${income.amount.toLocaleString()}`);
  });

  // 3. Calculate total revenue
  const totalRevenue = registrationRevenue + additionalIncome;
  console.log(`💸 Total Revenue: €${totalRevenue.toLocaleString()}`);

  // 4. Separate and calculate expense entries
  const expenseEntries = allIncomeExpenses.filter(
    (item) => item.type === "expense" || !item.type
  );
  const totalExpenses = expenseEntries.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  console.log(`💳 Total Expenses: €${totalExpenses.toLocaleString()}`);
  console.log(`   - From ${expenseEntries.length} expense entries:`);

  // Group expenses by category for better visualization
  const expensesByCategory = expenseEntries.reduce((acc, expense) => {
    if (!acc[expense.name]) {
      acc[expense.name] = [];
    }
    acc[expense.name].push(expense);
    return acc;
  }, {} as Record<string, typeof expenseEntries>);

  Object.entries(expensesByCategory).forEach(([category, expenses]) => {
    const categoryTotal = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    console.log(
      `     • ${category}: €${categoryTotal.toLocaleString()} (${
        expenses.length
      } entries)`
    );
  });

  // 5. Calculate profit
  const profit = totalRevenue - totalExpenses;
  console.log(`📈 Profit/Loss: €${profit.toLocaleString()}`);

  if (profit > 0) {
    console.log(`✅ PROFIT: €${profit.toLocaleString()}`);
  } else if (profit < 0) {
    console.log(`❌ LOSS: €${Math.abs(profit).toLocaleString()}`);
  } else {
    console.log(`⚖️ BREAK EVEN`);
  }

  console.log("================================\n");

  return {
    registrationRevenue,
    additionalIncome,
    totalRevenue,
    totalExpenses,
    profit,
    incomeEntries,
    expenseEntries,
  };
}

export function validateCalculationConsistency(
  manualResult: ReturnType<typeof manualProfitCalculation>,
  componentResult: {
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    additionalIncome: number;
  }
) {
  console.log("\n🔍 CALCULATION CONSISTENCY CHECK");
  console.log("=================================");

  const checks = [
    {
      name: "Additional Income",
      manual: manualResult.additionalIncome,
      component: componentResult.additionalIncome,
    },
    {
      name: "Total Revenue",
      manual: manualResult.totalRevenue,
      component: componentResult.totalRevenue,
    },
    {
      name: "Total Expenses",
      manual: manualResult.totalExpenses,
      component: componentResult.totalExpenses,
    },
    {
      name: "Profit/Loss",
      manual: manualResult.profit,
      component: componentResult.profit,
    },
  ];

  let allMatch = true;

  checks.forEach((check) => {
    const matches = Math.abs(check.manual - check.component) < 0.01; // Account for floating point precision
    console.log(`${matches ? "✅" : "❌"} ${check.name}:`);
    console.log(`   Manual: €${check.manual.toLocaleString()}`);
    console.log(`   Component: €${check.component.toLocaleString()}`);
    if (!matches) {
      console.log(
        `   ⚠️ MISMATCH: Difference of €${Math.abs(
          check.manual - check.component
        ).toLocaleString()}`
      );
      allMatch = false;
    }
  });

  console.log("=================================");
  console.log(
    allMatch
      ? "🎉 ALL CALCULATIONS MATCH!"
      : "⚠️ CALCULATION MISMATCHES DETECTED!"
  );
  console.log("=================================\n");

  return allMatch;
}
