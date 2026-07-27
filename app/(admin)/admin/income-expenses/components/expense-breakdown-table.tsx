"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, Check, X } from "lucide-react";
import { ExpenseData } from "../types/expense.types";
import {
  getExpenseCategoryColor,
  findHighestExpense,
  sortExpensesByAmount,
  calculateTotalExpenses,
  calculateExpensePercentage,
  formatCurrency,
  parseExpenseAmount,
} from "../utils/expense.utils";
import { useToast } from "@/hooks/use-toast";
import { getExpenseCategoryLabel } from "@/app/(admin)/admin/utils/labels";

interface ExpenseBreakdownTableProps {
  expenses: ExpenseData[];
  onExpenseUpdate?: (updatedExpense: ExpenseData) => void;
}

interface EditableAmountProps {
  expense: ExpenseData;
  isHighest: boolean;
  onUpdate?: (updatedExpense: ExpenseData) => void;
}

function EditableAmount({ expense, isHighest, onUpdate }: EditableAmountProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(expense.amount);

  // Sync local amount state when expense prop changes
  useEffect(() => {
    setAmount(expense.amount);
  }, [expense.amount]);

  // Debug: Log expense data to see its structure
  console.log("EditableAmount - expense:", expense);
  console.log("EditableAmount - expense.id:", expense.id);
  console.log("EditableAmount - expense._id:", expense._id);

  const handleSave = async () => {
    const expenseId = expense.id || expense._id;

    if (!expenseId) {
      toast({
        title: "Não é possível editar",
        description:
          "Esta despesa precisa de ser guardada na base de dados primeiro.",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsedAmount = parseExpenseAmount(amount.toString());

      if (parsedAmount <= 0) {
        toast({
          title: "Erro de Validação",
          description: "O valor deve ser maior que 0",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/income-expense", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: expenseId,
          name: expense.name,
          amount: parsedAmount,
          type: "expense",
          description: expense.description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update expense");
      }

      const updatedExpense: ExpenseData = {
        ...expense,
        amount: parsedAmount,
        // Ensure both id fields are preserved for proper matching
        id: expense.id || expense._id,
        _id: expense._id || expense.id,
      };

      onUpdate?.(updatedExpense);
      setIsEditing(false);

      toast({
        title: "Sucesso",
        description: "Despesa atualizada com sucesso",
      });
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar a despesa. Por favor tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setAmount(expense.amount);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-end gap-2">
        <Input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-24 text-right"
          autoFocus
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-green-100"
          onClick={handleSave}
        >
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-red-100"
          onClick={handleCancel}
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <span className={isHighest ? "font-bold text-red-600" : ""}>
        {formatCurrency(expense.amount)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-gray-100"
        onClick={() => setIsEditing(true)}
        disabled={!expense.id && !expense._id}
        title={
          !expense.id && !expense._id
            ? "Guarde primeiro na base de dados para poder editar"
            : "Editar valor"
        }
      >
        <MoreVertical
          className={`h-4 w-4 ${
            !expense.id && !expense._id ? "text-gray-400" : ""
          }`}
        />
      </Button>
    </div>
  );
}

export function ExpenseBreakdownTable({
  expenses,
  onExpenseUpdate,
}: ExpenseBreakdownTableProps) {
  // Find the biggest expense for highlighting
  const biggestExpense = findHighestExpense(expenses);

  // Calculate total expenses
  const totalExpenses = calculateTotalExpenses(expenses);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhe de Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead>Descrição Breve</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">% do Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortExpensesByAmount(expenses).map((expense) => {
              const percentage = calculateExpensePercentage(
                expense.amount,
                totalExpenses
              );
              const isHighest = Boolean(
                biggestExpense && expense.name === biggestExpense.name
              );

              return (
                <TableRow key={expense.id || expense._id || expense.name}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getExpenseCategoryColor(expense.name)}
                    >
                      {getExpenseCategoryLabel(expense.name)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {expense.description || "Sem descrição disponível"}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <EditableAmount
                      expense={expense}
                      isHighest={isHighest}
                      onUpdate={onExpenseUpdate}
                    />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {percentage}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
