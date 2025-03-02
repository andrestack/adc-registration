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
import { MoreHorizontal } from "lucide-react";
//import { useState } from "react";

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

export type Registration = {
  _id: string;
  fullName: string;
  email: string;
  workshops: Array<{
    id: string;
    level?: string;
  }>;
  accommodation: {
    type: "tent" | "family-room" | "single-room" | "bungalow";
    nights: number;
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
  total: number;
  createdAt: string;
};

export const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
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
              {workshop.id}
              {workshop.level ? ` (${workshop.level})` : ""}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "accommodation",
    header: "Accommodation",
    cell: ({ row }) => {
      const accommodation = row.original.accommodation;
      return (
        <span>
          {accommodation.type} ({accommodation.nights} nights)
        </span>
      );
    },
  },
  {
    accessorKey: "food",
    header: "Food",
    cell: ({ row }) => {
      const food = row.original.food;
      return (
        <span>
          {food.type} ({food.days} days)
        </span>
      );
    },
  },
  {
    accessorKey: "total",
    header: "To be paid",
    cell: ({ row }) => {
      const initialPayment =
        100 +
        (row.original.accommodation.type.includes("room") ||
        row.original.accommodation.type === "bungalow"
          ? row.original.accommodation.nights *
            (row.original.accommodation.type === "bungalow" ? 80 : 40)
          : 0);
      const remainingPayment = row.original.total - initialPayment;
      return <span>€{remainingPayment}</span>;
    },
  },
  {
    accessorKey: "paid",
    header: "Paid",
    cell: ({ row }) => {
      return row.original.paymentMade ? (
        <span>€{row.original.total}</span>
      ) : (
        <span>€0</span>
      );
    },
  },
  {
    accessorKey: "paymentMade",
    header: "Payment Status",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Badge variant={row.original.paymentMade ? "success" : "destructive"}>
            {row.original.paymentMade ? "Paid" : "Pending"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await updatePaymentStatus(
                      row.original._id,
                      !row.original.paymentMade
                    );
                    // Refresh the page to show updated data
                    window.location.reload();
                  } catch (error) {
                    console.error("Failed to update payment status:", error);
                    alert("Failed to update payment status. Please try again.");
                  }
                }}
              >
                Mark as {row.original.paymentMade ? "Unpaid" : "Paid"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registration Date",
    cell: ({ row }) => {
      return <span>{formatDate(row.original.createdAt)}</span>;
    },
  },
];
