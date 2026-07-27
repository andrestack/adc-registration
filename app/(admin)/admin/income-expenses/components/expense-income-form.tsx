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
import { getExpenseCategoryLabel } from "@/app/(admin)/admin/utils/labels";

interface ExpenseIncomeFormProps {
  onSubmit: (data: ExpenseData & { type: "income" | "expense" }) => void;
  onSuccess?: () => void;
}

export function ExpenseIncomeForm({
  onSubmit,
  onSuccess,
}: ExpenseIncomeFormProps) {
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
          title: "Erro de Validação",
          description: validation.errors.join(", "),
          variant: "destructive",
        });
        return;
      }

      if (!category) {
        toast({
          title: "Erro de Validação",
          description: "Por favor selecione uma categoria",
          variant: "destructive",
        });
        return;
      }

      // Submit to API
      const response = await fetch("/api/income-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: category,
          amount: parsedAmount,
          description: description.trim() || undefined,
          type,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit data");
      }

      // Create data for local state update
      const submitData = {
        ...(formData as ExpenseData),
        type,
        id:
          result.data._id ||
          `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        dateCreated: result.data.createdAt || new Date().toISOString(),
      };

      // Update local state
      onSubmit(submitData);

      // Reset form
      setCategory("");
      setDescription("");
      setAmount("");

      // Call success callback if provided
      onSuccess?.();

      toast({
        title: "Sucesso",
        description:
          result.message ||
          `${
            type === "income" ? "Receita" : "Despesa"
          } adicionada com sucesso`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro",
        description: "Falha ao submeter o formulário. Por favor tente novamente.",
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
        <CardTitle>
          Adicionar {type === "income" ? "Receita" : "Despesa"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Income/Expense Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as "income" | "expense")}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="cursor-pointer">
                  Despesa
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="cursor-pointer">
                  Receita
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar categoria" />
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
                        {getExpenseCategoryLabel(cat.name)}
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
                {getExpenseCategoryLabel(category)}
              </Badge>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição Breve
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Introduza uma breve descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground">
              {description.length}/500 caracteres
            </div>
          </div>

          {/* Amount Field */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-medium">
              Valor (€)
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
              ? "A adicionar..."
              : `Adicionar ${type === "income" ? "Receita" : "Despesa"}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
