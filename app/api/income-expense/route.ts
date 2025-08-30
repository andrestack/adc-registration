import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import IncomeExpense from "@/models/IncomeExpense";
import { IncomeExpenseFormData } from "@/app/admin/income-expenses/types/expense.types";

// GET - Fetch all income and expenses
export async function GET() {
  try {
    await dbConnect();

    const incomeExpenses = await IncomeExpense.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: incomeExpenses,
      message: "Income and expenses fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching income/expenses:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch income and expenses",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new income or expense entry
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate required fields
    const { name, amount, type, description } =
      body as IncomeExpenseFormData & {
        description?: string;
      };

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Category name is required and must be a string",
        },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== "number" || amount < 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Amount is required and must be a positive number",
        },
        { status: 400 }
      );
    }

    if (!type || !["income", "expense"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Type is required and must be either 'income' or 'expense'",
        },
        { status: 400 }
      );
    }

    // Create new income/expense entry
    const newEntry = new IncomeExpense({
      name: name.trim(),
      amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
      type,
      description: description?.trim() || undefined,
      category: name.trim(), // Use name as category for now
      createdBy: "admin", // TODO: Replace with actual user when auth is implemented
    });

    // Save to database
    const savedEntry = await newEntry.save();

    return NextResponse.json({
      success: true,
      data: savedEntry,
      message: `${
        type === "income" ? "Income" : "Expense"
      } created successfully`,
    });
  } catch (error) {
    console.error("Error creating income/expense:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create income/expense entry",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing income or expense entry
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id, name, amount, type, description } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID is required for updating",
        },
        { status: 400 }
      );
    }

    // Find and update the entry
    const updatedEntry = await IncomeExpense.findByIdAndUpdate(
      id,
      {
        name: name?.trim(),
        amount: amount ? Math.round(amount * 100) / 100 : undefined,
        type,
        description: description?.trim() || undefined,
        category: name?.trim(),
        updatedBy: "admin", // TODO: Replace with actual user when auth is implemented
      },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return NextResponse.json(
        {
          success: false,
          error: "Income/Expense entry not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedEntry,
      message: `${
        type === "income" ? "Income" : "Expense"
      } updated successfully`,
    });
  } catch (error) {
    console.error("Error updating income/expense:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update income/expense entry",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove income or expense entry
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID is required for deletion",
        },
        { status: 400 }
      );
    }

    const deletedEntry = await IncomeExpense.findByIdAndDelete(id);

    if (!deletedEntry) {
      return NextResponse.json(
        {
          success: false,
          error: "Income/Expense entry not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedEntry,
      message: `${
        deletedEntry.type === "income" ? "Income" : "Expense"
      } deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting income/expense:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete income/expense entry",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
