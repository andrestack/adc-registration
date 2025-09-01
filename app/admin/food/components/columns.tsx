"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

// Food pricing from schema
const FOOD_PRICES = {
  full: 35, // €35 per day for 3 meals
  single: 15, // €15 per day for 1 meal
  none: 0,
} as const;

interface Food {
  type: "full" | "single" | "none";
  days: number;
}

export interface FoodParticipantData {
  _id?: string;
  fullName: string;
  email: string;
  food: Food;
  paymentMade?: boolean;
}

// Helper function to get food type display name
function getFoodTypeDisplay(type: string): string {
  switch (type) {
    case "full":
      return "3x Meals";
    case "single":
      return "1x Meal";
    case "none":
      return "No Meals";
    default:
      return type;
  }
}

// Helper function to get food type badge color
function getFoodTypeBadgeVariant(
  type: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (type) {
    case "full":
      return "default";
    case "single":
      return "secondary";
    case "none":
      return "outline";
    default:
      return "outline";
  }
}

// Helper function to calculate food cost
function calculateFoodCost(food: Food): number {
  const pricePerDay = FOOD_PRICES[food.type];
  return pricePerDay * food.days;
}

export const columns: ColumnDef<FoodParticipantData>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "food.type",
    header: "Food Type",
    cell: ({ row }) => {
      const type = row.original.food.type;
      return (
        <Badge variant={getFoodTypeBadgeVariant(type)}>
          {getFoodTypeDisplay(type)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "food.days",
    header: "Days",
    cell: ({ row }) => {
      return <span className="font-mono">{row.original.food.days}</span>;
    },
  },
  {
    accessorKey: "foodCost",
    header: "Food Cost",
    cell: ({ row }) => {
      const cost = calculateFoodCost(row.original.food);
      return <span className="font-mono">€{cost}</span>;
    },
  },
  {
    accessorKey: "pricePerDay",
    header: "Price/Day",
    cell: ({ row }) => {
      const pricePerDay = FOOD_PRICES[row.original.food.type];
      return (
        <span className="font-mono text-muted-foreground">€{pricePerDay}</span>
      );
    },
  },
];

// Export food pricing for use in other components
export { FOOD_PRICES };
