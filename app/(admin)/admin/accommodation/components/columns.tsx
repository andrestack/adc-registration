"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { getAccommodationTypeLabel } from "@/app/(admin)/admin/utils/labels";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, MoreVertical } from "lucide-react";

// Assuming the Participant interface from your page.tsx is consistent
interface Accommodation {
  type: "tent" | "family-room" | "single-room" | "bungalow" | "already-booked";
  nights: number;
  bungalowUnit?: number;
  bungalowRoom?: "single" | "family" | "whole";
}

export interface ParticipantData {
  _id?: string;
  fullName: string;
  email: string;
  accommodation: Accommodation;
  isPrimaryBooking?: boolean;
  primaryRegistrantName?: string;
  // other fields like paymentMade can be added if needed for display or filtering
  paymentMade?: boolean;
}

const BUNGALOW_TYPES = ["bungalow", "single-room", "family-room"] as const;

// A booking's type only determines the default room slot for "bungalow"
// (always whole); single-room/family-room bookings can end up physically
// placed in either room, so both are offered.
function defaultRoomForType(
  type: Accommodation["type"]
): "single" | "family" | "whole" {
  return type === "bungalow" ? "whole" : "single";
}

async function updateBungalowAssignment(
  id: string,
  bungalowUnit: number | null,
  bungalowRoom: "single" | "family" | "whole" | null,
  accommodationType?: string
) {
  const body: Record<string, unknown> = { bungalowUnit, bungalowRoom };
  if (accommodationType) body.accommodationType = accommodationType;

  const response = await fetch(`/api/registration/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update bungalow assignment");
  }
  return data;
}

function EditableBungalowAssignment({
  id,
  type,
  bungalowUnit,
  bungalowRoom,
}: {
  id: string;
  type: Accommodation["type"];
  bungalowUnit?: number;
  bungalowRoom?: "single" | "family" | "whole";
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [unit, setUnit] = useState<string>(
    bungalowUnit ? String(bungalowUnit) : ""
  );
  const [room, setRoom] = useState<"single" | "family" | "whole">(
    bungalowRoom || defaultRoomForType(type)
  );

  if (!BUNGALOW_TYPES.includes(type as (typeof BUNGALOW_TYPES)[number])) {
    return <span className="text-muted-foreground">N/A</span>;
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Select value={unit} onValueChange={setUnit}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Unidade" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((n) => (
              <SelectItem key={n} value={String(n)}>
                Bungalow {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {type !== "bungalow" && (
          <Select
            value={room}
            onValueChange={(v) => setRoom(v as "single" | "family")}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Quarto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Individual</SelectItem>
              <SelectItem value="family">Família</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-green-100"
          onClick={async () => {
            if (!unit) {
              alert("Escolha uma unidade de bungalow.");
              return;
            }
            const effectiveRoom = type === "bungalow" ? "whole" : room;
            try {
              await updateBungalowAssignment(
                id,
                Number(unit),
                effectiveRoom
              );
              setIsEditing(false);
              window.location.reload();
            } catch (error) {
              alert(
                error instanceof Error
                  ? error.message
                  : "Falha ao atribuir bungalow. Tente novamente."
              );
            }
          }}
        >
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-red-100"
          onClick={() => {
            setUnit(bungalowUnit ? String(bungalowUnit) : "");
            setRoom(bungalowRoom || defaultRoomForType(type));
            setIsEditing(false);
          }}
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span>
        {bungalowUnit
          ? `Bungalow ${bungalowUnit}${
              type !== "bungalow" && bungalowRoom
                ? ` (${bungalowRoom === "single" ? "individual" : "família"})`
                : ""
            }`
          : "Não atribuído"}
      </span>
      {type !== "bungalow" && bungalowUnit && (
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            if (
              !confirm(
                `Converter esta reserva para Bungalow Completo no Bungalow ${bungalowUnit}?`
              )
            )
              return;
            try {
              await updateBungalowAssignment(
                id,
                bungalowUnit,
                "whole",
                "bungalow"
              );
              window.location.reload();
            } catch (error) {
              alert(
                error instanceof Error
                  ? error.message
                  : "Falha ao converter para bungalow completo."
              );
            }
          }}
        >
          Converter para Completo
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-gray-100"
        onClick={() => setIsEditing(true)}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  );
}

export const columns: ColumnDef<ParticipantData>[] = [
  {
    accessorKey: "fullName",
    header: "Nome Completo",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "accommodation.type",
    header: "Tipo Aloj.",
    cell: ({ row }) => {
      const type = row.original.accommodation.type;
      return <span className="capitalize">{getAccommodationTypeLabel(type)}</span>;
    },
  },
  {
    accessorKey: "accommodation.nights",
    header: "Noites",
  },
  {
    id: "bungalowAssignment",
    header: "Bungalow Atribuído",
    cell: ({ row }) => {
      const { accommodation, _id, isPrimaryBooking, primaryRegistrantName } =
        row.original;
      if (!_id) return null;
      // Additional registrants share the primary's unit — nothing to assign.
      // See lib/accommodation-availability.ts for the physical model.
      if (isPrimaryBooking === false) {
        return (
          <span className="text-muted-foreground">
            Partilhado com {primaryRegistrantName ?? "o titular"}
          </span>
        );
      }
      return (
        <EditableBungalowAssignment
          id={_id}
          type={accommodation.type}
          bungalowUnit={accommodation.bungalowUnit}
          bungalowRoom={accommodation.bungalowRoom}
        />
      );
    },
  },
];
