"use client";

import { AccommodationPage } from "./components/accommodation-page";
import { useEffect, useState } from "react";
import { AccommodationStatsCards } from "./components/accommodation-stats-cards";
import { BungalowOccupancyGrid } from "./components/bungalow-occupancy-grid";

interface Accommodation {
  type: "tent" | "family-room" | "single-room" | "bungalow" | "already-booked";
  nights: number;
  bungalowUnit?: number;
  bungalowRoom?: "single" | "family" | "whole";
}

// Updated Participant interface to be comprehensive for this page
interface Participant {
  _id?: string; // From MongoDB, useful for keys
  fullName: string;
  email: string;
  accommodation: Accommodation;
  workshops?: Array<{ id: string; level?: string }>; // Example from schema
  food?: { type: string; days: number }; // Example from schema
  total?: number; // Example from schema
  paymentMade?: boolean; // From schema, potentially useful
  isPrimaryBooking?: boolean;
  primaryRegistrantName?: string;
  // Add other fields from RegistrationFormData / MongoDB document as needed
}

// No longer filtering by a single target type
// const TARGET_ACCOMMODATION_TYPE = "tent";

export default function AdminAccommodationPage() {
  // Using Participant[] as the filter ensures accommodation is present
  const [accommodationBookings, setAccommodationBookings] = useState<
    Participant[]
  >([]);
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
        const allRegistrations = responseData.data as Participant[];

        if (!Array.isArray(allRegistrations)) {
          console.error("Fetched data.data is not an array:", allRegistrations);
          throw new Error("Invalid data format from API");
        }

        const filteredBookings = allRegistrations.filter(
          (participant: Participant) =>
            participant.accommodation &&
            participant.accommodation.type !== "already-booked"
        );

        setAccommodationBookings(filteredBookings);
      } catch (error) {
        console.error("Failed to fetch or filter registrations:", error);
        setAccommodationBookings([]);
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
          Gestão de Alojamento 2026
        </h2>
        <p className="text-muted-foreground">
          Visão geral de todas as reservas de alojamento no local para o ADC
          2026.
        </p>
      </div>

      <AccommodationStatsCards data={accommodationBookings} />

      <BungalowOccupancyGrid data={accommodationBookings} />

      <AccommodationPage // This component will be refactored to use DataTable
        title="Todas as Reservas de Alojamento"
        participants={accommodationBookings}
        isLoading={isLoading}
      />
    </div>
  );
}
