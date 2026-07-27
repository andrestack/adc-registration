"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FOOD_PRICES } from "./columns";

interface Food {
  type: "full" | "single" | "none";
  days: number;
}

interface FoodParticipant {
  _id?: string;
  fullName: string;
  email: string;
  food: Food;
}

interface FoodStatsCardsProps {
  data: FoodParticipant[];
}

interface FoodCounts {
  [key: string]: number;
}

export function FoodStatsCards({ data }: FoodStatsCardsProps) {
  if (!data) {
    return null;
  }

  // Filter out participants with no food selection
  const participantsWithFood = data.filter(
    (participant) => participant.food.type !== "none"
  );

  const totalFoodBookings = participantsWithFood.length;

  // Count bookings by food type
  const bookingsByType = participantsWithFood.reduce<FoodCounts>(
    (acc, participant) => {
      const type = participant.food.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {}
  );

  // Calculate total food revenue
  const totalFoodRevenue = participantsWithFood.reduce((sum, participant) => {
    const pricePerDay = FOOD_PRICES[participant.food.type];
    return sum + pricePerDay * participant.food.days;
  }, 0);

  // Calculate average days per booking
  const totalDays = participantsWithFood.reduce(
    (sum, participant) => sum + participant.food.days,
    0
  );
  const averageDays = totalFoodBookings > 0 ? totalDays / totalFoodBookings : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Food Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFoodBookings}</div>
          <p className="text-xs text-muted-foreground">
            Participants with food selected
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Full Meals (3x)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookingsByType.full || 0}</div>
          <p className="text-xs text-muted-foreground">
            €35/day - Breakfast, lunch & dinner
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Single Meals (1x)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bookingsByType.single || 0}</div>
          <p className="text-xs text-muted-foreground">
            €15/day - One meal per day
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Food Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalFoodRevenue}</div>
          <p className="text-xs text-muted-foreground">
            Avg {averageDays.toFixed(1)} days per booking
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


