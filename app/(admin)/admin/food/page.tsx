"use client";

import { FoodPage } from "./components/food-page";
import { FoodStatsCards } from "./components/food-stats-cards";
import { useEffect, useState } from "react";

interface Food {
  type: "full" | "single" | "none";
  days: number;
}

interface FoodParticipant {
  _id?: string;
  fullName: string;
  email: string;
  food: Food;
  workshops?: Array<{ id: string; level?: string }>;
  accommodation?: {
    type:
      | "tent"
      | "family-room"
      | "single-room"
      | "bungalow"
      | "already-booked";
    nights: number;
  };
  total?: number;
  paymentMade?: boolean;
}

export default function AdminFoodPage() {
  const [foodParticipants, setFoodParticipants] = useState<FoodParticipant[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setIsLoading(true);
      try {
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${baseUrl}/api/registration?year=2026`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch registrations: ${res.statusText}`);
        }

        const responseData = await res.json();
        const allRegistrations = responseData.data as FoodParticipant[];

        if (!Array.isArray(allRegistrations)) {
          console.error("Fetched data.data is not an array:", allRegistrations);
          throw new Error("Invalid data format from API");
        }

        // Filter participants who have selected food (excluding "none")
        const filteredParticipants = allRegistrations.filter(
          (participant: FoodParticipant) =>
            participant.food && participant.food.type !== "none"
        );

        setFoodParticipants(filteredParticipants);
      } catch (error) {
        console.error("Failed to fetch or filter registrations:", error);
        setFoodParticipants([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Food Management 2026
        </h2>
        <p className="text-muted-foreground">
          Overview of all food and meal bookings for ADC 2026.
        </p>
      </div>

      <FoodStatsCards data={foodParticipants} />

      <FoodPage
        title="Food Bookings"
        participants={foodParticipants}
        isLoading={isLoading}
      />
    </div>
  );
}


