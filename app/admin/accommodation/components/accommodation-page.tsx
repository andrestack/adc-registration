"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { DataTable } from "@/app/admin/components/data-table"; // Assuming generic DataTable path
import { columns, ParticipantData } from "./columns"; // Import columns and ParticipantData type

interface AccommodationPageProps {
  title: string;
  participants: ParticipantData[]; // Use ParticipantData from columns.tsx
  isLoading: boolean;
}

export function AccommodationPage({
  title,
  participants,
  isLoading,
}: AccommodationPageProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              {" "}
              {/* Increased height for spinner view */}
              <Spinner />{" "}
              {/* Assuming Spinner can take a size prop */}
            </div>
          ) : (
            <DataTable columns={columns} data={participants} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
