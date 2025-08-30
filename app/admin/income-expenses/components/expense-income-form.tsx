"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ExpenseData,
  DEFAULT_EXPENSE_CATEGORIES,
} from "../types/expense.types";
import {
  validateExpenseData,
  parseExpenseAmount,
  getExpenseCategoryColor,
} from "../utils/expense.utils";
import { useToast } from "@/hooks/use-toast";

interface ExpenseIncomeFormProps {
  onSubmit: (data: ExpenseData & { type: "income" | "expense" }) => void;
}

export function ExpenseIncomeForm({ onSubmit }: ExpenseIncomeFormProps) {
  const { toast } = useToast();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedAmount = parseExpenseAmount(amount);

      const formData: Partial<ExpenseData> = {
        name: category,
        amount: parsedAmount,
        description: description.trim() || undefined,
      };

      const validation = validateExpenseData(formData);

      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: validation.errors.join(", "),
          variant: "destructive",
        });
        return;
      }

      if (!category) {
        toast({
          title: "Validation Error",
          description: "Please select a category",
          variant: "destructive",
        });
        return;
      }

      const submitData = {
        ...(formData as ExpenseData),
        type,
        id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        dateCreated: new Date().toISOString(),
      };

      onSubmit(submitData);

      // Reset form
      setCategory("");
      setDescription("");
      setAmount("");

      toast({
        title: "Success",
        description: `${
          type === "income" ? "Income" : "Expense"
        } added successfully`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryData = DEFAULT_EXPENSE_CATEGORIES.find(
    (cat) => cat.name === category
  );

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Add {type === "income" ? "Income" : "Expense"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Income/Expense Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as "income" | "expense")}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="cursor-pointer">
                  Expense
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="cursor-pointer">
                  Income
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_EXPENSE_CATEGORIES.filter((cat) => cat.isActive).map(
                  (cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            cat.color.split(" ")[0]
                          }`}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {selectedCategoryData && (
              <Badge
                variant="outline"
                className={`${getExpenseCategoryColor(category)} w-fit`}
              >
                {category}
              </Badge>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium">
              Short Description
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Enter a brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground">
              {description.length}/500 characters
            </div>
          </div>

          {/* Amount Field */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount (€)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !category || !amount}
          >
            {isSubmitting
              ? "Adding..."
              : `Adicionar ${type === "income" ? "Income" : "Expense"}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
