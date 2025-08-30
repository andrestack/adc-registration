import mongoose, { Schema } from "mongoose";

// Define the income/expense schema
const IncomeExpenseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      maxlength: [100, "Category name must be less than 100 characters"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
      validate: {
        validator: function (value: number) {
          return Number.isFinite(value) && value >= 0;
        },
        message: "Amount must be a valid positive number",
      },
    },
    description: {
      type: String,
      required: false,
      maxlength: [500, "Description must be less than 500 characters"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: ["income", "expense"],
        message: "Type must be either 'income' or 'expense'",
      },
    },
    category: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, "Category must be less than 100 characters"],
    },
    createdBy: {
      type: String,
      required: false,
      trim: true,
      maxlength: [255, "Created by field must be less than 255 characters"],
    },
    updatedBy: {
      type: String,
      required: false,
      trim: true,
      maxlength: [255, "Updated by field must be less than 255 characters"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: "IncomeExpenses",
  }
);

// Add indexes for better query performance
IncomeExpenseSchema.index({ type: 1 });
IncomeExpenseSchema.index({ name: 1 });
IncomeExpenseSchema.index({ createdAt: -1 });
IncomeExpenseSchema.index({ type: 1, createdAt: -1 });

// Add a virtual for formatted amount
IncomeExpenseSchema.virtual("formattedAmount").get(function () {
  return `€${this.amount.toLocaleString()}`;
});

// Add a method to calculate percentage of total
IncomeExpenseSchema.methods.calculatePercentage = function (total: number) {
  if (total === 0) return "0.0";
  return ((this.amount / total) * 100).toFixed(1);
};

// Static method to get all expenses
IncomeExpenseSchema.statics.getExpenses = function () {
  return this.find({ type: "expense" }).sort({ createdAt: -1 });
};

// Static method to get all income
IncomeExpenseSchema.statics.getIncome = function () {
  return this.find({ type: "income" }).sort({ createdAt: -1 });
};

// Static method to get total by type
IncomeExpenseSchema.statics.getTotalByType = function (
  type: "income" | "expense"
) {
  return this.aggregate([
    { $match: { type } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
};

// Static method to get expenses grouped by category
IncomeExpenseSchema.statics.getExpensesByCategory = function () {
  return this.aggregate([
    { $match: { type: "expense" } },
    {
      $group: {
        _id: "$name",
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
        items: { $push: "$$ROOT" },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);
};

// Pre-save middleware to validate and format data
IncomeExpenseSchema.pre("save", function (next) {
  // Ensure amount is rounded to 2 decimal places
  if (this.amount) {
    this.amount = Math.round(this.amount * 100) / 100;
  }

  // Trim whitespace from string fields
  if (this.name) this.name = this.name.trim();
  if (this.description) this.description = this.description.trim();
  if (this.category) this.category = this.category.trim();

  next();
});

// Create and export the model
export default mongoose.models.IncomeExpense ||
  mongoose.model("IncomeExpense", IncomeExpenseSchema, "IncomeExpenses");
