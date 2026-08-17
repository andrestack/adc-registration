"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import {
  getAccommodationTypeLabel,
  getFoodTypeLabel,
  getWorkshopLabel,
  getWorkshopLevelLabel,
} from "@/app/(admin)/admin/utils/labels";
import { MoreHorizontal, Check, X, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

async function updatePaymentStatus(id: string, status: boolean) {
  try {
    const response = await fetch(`/api/registration/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentMade: status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update payment status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
}

async function deleteRegistration(id: string) {
  try {
    const response = await fetch(`/api/registration/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete registration");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting registration:", error);
    throw error;
  }
}

async function updateInitialPayment(id: string, amount: number) {
  try {
    const response = await fetch(`/api/registration/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initialPayment: amount }),
    });

    if (!response.ok) {
      throw new Error("Failed to update initial payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating initial payment:", error);
    throw error;
  }
}

export type Registration = {
  _id: string;
  fullName: string;
  email: string;
  workshops: Array<{
    id: string;
    level?: string;
  }>;
  accommodation: {
    type:
      | "tent"
      | "family-room"
      | "single-room"
      | "bungalow"
      | "already-booked";
    nights: number;
    bungalowUnit?: number;
    bungalowRoom?: "single" | "family" | "whole";
  };
  food: {
    type: "full" | "single" | "none";
    days: number;
  };
  children: {
    "under-5": number;
    "5-10": number;
    "10-17": number;
  };
  paymentMade: boolean;
  initialPayment?: number;
  total: number;
  createdAt: string;
};

interface EditablePaymentProps {
  id: string;
  initialPayment: number;
  defaultAmount: number;
}

function EditablePayment({
  id,
  initialPayment,
  defaultAmount,
}: EditablePaymentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(initialPayment || defaultAmount);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-24"
          min={0}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-green-100"
          onClick={async () => {
            try {
              await updateInitialPayment(id, amount);
              setIsEditing(false);
              window.location.reload();
            } catch {
              alert("Falha ao atualizar o pagamento inicial. Tente novamente.");
            }
          }}
        >
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-red-100"
          onClick={() => {
            setAmount(initialPayment || defaultAmount);
            setIsEditing(false);
          }}
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span>€{initialPayment || defaultAmount}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-gray-100"
        onClick={() => setIsEditing(true)}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  );
}

export const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "fullName",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "workshops",
    header: "Workshops",
    cell: ({ row }) => {
      const workshops = row.original.workshops;
      return (
        <div className="flex flex-wrap gap-1">
          {workshops.map((workshop, idx) => (
            <Badge key={idx} variant="secondary">
              {getWorkshopLabel(workshop.id)}
              {workshop.level ? ` (${getWorkshopLevelLabel(workshop.level)})` : ""}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "accommodation",
    header: "Alojamento",
    cell: ({ row }) => {
      const accommodation = row.original.accommodation;
      return (
        <span>
          {getAccommodationTypeLabel(accommodation.type)} ({accommodation.nights} noites)
        </span>
      );
    },
  },
  {
    accessorKey: "food",
    header: "Comida",
    cell: ({ row }) => {
      const food = row.original.food;
      return (
        <span>
          {getFoodTypeLabel(food.type)} ({food.days} dias)
        </span>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      return <span>€{row.original.total}</span>;
    },
  },
  {
    accessorKey: "initialPayment",
    header: "Pagamento Inicial",
    cell: ({ row }) => {
      const defaultInitialPayment =
        100 +
        (row.original.accommodation.type !== "already-booked" &&
        (row.original.accommodation.type.includes("room") ||
          row.original.accommodation.type === "bungalow")
          ? row.original.accommodation.nights *
            (row.original.accommodation.type === "bungalow" ? 80 : 40)
          : 0);

      return (
        <EditablePayment
          id={row.original._id}
          initialPayment={row.original.initialPayment || 0}
          defaultAmount={defaultInitialPayment}
        />
      );
    },
  },
  {
    accessorKey: "remainingPayment",
    header: "A pagar no local",
    cell: ({ row }) => {
      const defaultInitialPayment =
        100 +
        (row.original.accommodation.type !== "already-booked" &&
        (row.original.accommodation.type.includes("room") ||
          row.original.accommodation.type === "bungalow")
          ? row.original.accommodation.nights *
            (row.original.accommodation.type === "bungalow" ? 80 : 40)
          : 0);

      const initialPayment =
        row.original.initialPayment || defaultInitialPayment;
      return <span>€{Math.max(0, row.original.total - initialPayment)}</span>;
    },
  },
  {
    accessorKey: "paymentMade",
    header: "Pago no local",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.original.paymentMade}
            onCheckedChange={async (checked) => {
              try {
                await updatePaymentStatus(row.original._id, checked as boolean);
                window.location.reload();
              } catch (error) {
                console.error("Failed to update payment status:", error);
                alert("Falha ao atualizar o estado do pagamento. Tente novamente.");
              }
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600"
              onClick={async () => {
                if (
                  confirm("Tem a certeza que deseja eliminar esta inscrição?")
                ) {
                  try {
                    await deleteRegistration(row.original._id);
                    window.location.reload();
                  } catch (error) {
                    console.error("Failed to delete registration:", error);
                    alert("Falha ao eliminar a inscrição. Tente novamente.");
                  }
                }
              }}
            >
              Eliminar Inscrição
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data de Inscrição",
    cell: ({ row }) => {
      return <span>{formatDate(row.original.createdAt)}</span>;
    },
  },
];
