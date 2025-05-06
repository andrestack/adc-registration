"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Accommodation {
  type: "tent" | "family-room" | "single-room" | "bungalow" | "already-booked";
  nights: number;
}

interface Participant {
  _id?: string;
  fullName: string;
  email: string;
  accommodation: Accommodation;
  // other fields as defined in your main page
}

interface AccommodationStatsCardsProps {
  data: Participant[];
}

interface AccommodationCounts {
  [key: string]: number;
}

export function AccommodationStatsCards({
  data,
}: AccommodationStatsCardsProps) {
  if (!data) {
    return null; // Or a loading state
  }

  const totalBookings = data.length;

  const bookingsByType = data.reduce<AccommodationCounts>(
    (acc, participant) => {
      const type = participant.accommodation.type;
      if (type !== "already-booked") {
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  // Define the order of accommodation types for display
  const accommodationTypeOrder: Array<Accommodation["type"]> = [
    "tent",
    "family-room",
    "single-room",
    "bungalow",
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total On-site Bookings
          </CardTitle>
          {/* You can add an icon here if you have an icon library configured */}
          {/* <Users className="h-4 w-4 text-muted-foreground" /> */}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
          <p className="text-xs text-muted-foreground">
            Participants with on-site accommodation
          </p>
        </CardContent>
      </Card>

      {accommodationTypeOrder.map((type) => {
        if (bookingsByType[type] === undefined && type !== "already-booked")
          return null; // Don't show card if no bookings for this type
        return (
          <Card key={type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {type.replace("-", " ")}
              </CardTitle>
              {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookingsByType[type] || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Bookings for {type.replace("-", " ")}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
