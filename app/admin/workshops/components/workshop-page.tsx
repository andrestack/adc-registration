"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Participant {
  fullName: string;
  email: string;
  workshops: Array<{
    id: string;
    level?: string;
  }>;
}

interface WorkshopPageProps {
  title: string;
  workshopId: string;
  level?: string;
}

export function WorkshopPage({ title, workshopId, level }: WorkshopPageProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const baseUrl =
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${baseUrl}/api/registration`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch participants");
        }

        const data = await res.json();

        // Filter participants based on workshop and level
        const filteredParticipants = data.data.filter(
          (participant: Participant) =>
            participant.workshops.some(
              (workshop) =>
                workshop.id === workshopId &&
                (!level || workshop.level === level)
            )
        );

        setParticipants(filteredParticipants);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchParticipants();
  }, [workshopId, level]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading participants...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  {level && <TableHead>Level</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant, index) => (
                  <TableRow key={index}>
                    <TableCell>{participant.fullName}</TableCell>
                    <TableCell>{participant.email}</TableCell>
                    {level && (
                      <TableCell>
                        {
                          participant.workshops.find((w) => w.id === workshopId)
                            ?.level
                        }
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
