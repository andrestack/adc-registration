"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Accommodation {
  type: "tent" | "family-room" | "single-room" | "bungalow" | "already-booked";
  nights: number;
  bungalowUnit?: number;
  bungalowRoom?: "single" | "family" | "whole";
}

interface Participant {
  fullName: string;
  accommodation: Accommodation;
}

interface BungalowOccupancyGridProps {
  data: Participant[];
}

interface SlotOccupant {
  fullName: string;
}

export function BungalowOccupancyGrid({ data }: BungalowOccupancyGridProps) {
  const single: Record<number, SlotOccupant | undefined> = {};
  const family: Record<number, SlotOccupant | undefined> = {};
  const unassigned: Participant[] = [];

  for (const p of data) {
    const { type, bungalowUnit, bungalowRoom } = p.accommodation;
    if (!["bungalow", "single-room", "family-room"].includes(type)) continue;

    if (!bungalowUnit || !bungalowRoom) {
      unassigned.push(p);
      continue;
    }

    if (bungalowRoom === "whole") {
      single[bungalowUnit] = { fullName: p.fullName };
      family[bungalowUnit] = { fullName: p.fullName };
    } else if (bungalowRoom === "single") {
      single[bungalowUnit] = { fullName: p.fullName };
    } else {
      family[bungalowUnit] = { fullName: p.fullName };
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Ocupação de Bungalows
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="pr-4 py-1">Bungalow</th>
                <th className="pr-4 py-1">Quarto Individual</th>
                <th className="pr-4 py-1">Quarto Família</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((unit) => (
                <tr key={unit} className="border-t">
                  <td className="pr-4 py-2 font-medium">Bungalow {unit}</td>
                  <td className="pr-4 py-2">
                    {single[unit] ? (
                      single[unit]!.fullName
                    ) : (
                      <span className="text-green-600">Livre</span>
                    )}
                  </td>
                  <td className="pr-4 py-2">
                    {family[unit] ? (
                      family[unit]!.fullName
                    ) : (
                      <span className="text-green-600">Livre</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {unassigned.length > 0 && (
          <div className="mt-4 text-sm">
            <p className="font-medium text-amber-600">
              Ainda não atribuídos ({unassigned.length}):
            </p>
            <ul className="list-disc list-inside text-muted-foreground">
              {unassigned.map((p, i) => (
                <li key={i}>{p.fullName}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
