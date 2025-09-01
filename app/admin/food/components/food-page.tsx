"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { DataTable } from "@/app/admin/components/data-table";
import { columns, FoodParticipantData } from "./columns";

interface FoodPageProps {
  title: string;
  participants: FoodParticipantData[];
  isLoading: boolean;
}

export function FoodPage({ title, participants, isLoading }: FoodPageProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : (
            <DataTable columns={columns} data={participants} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
