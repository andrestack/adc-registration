"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getAccommodationTypeLabel } from "@/app/(admin)/admin/utils/labels";

// Assuming the Participant interface from your page.tsx is consistent
interface Accommodation {
  type: "tent" | "family-room" | "single-room" | "bungalow" | "already-booked";
  nights: number;
}

export interface ParticipantData {
  _id?: string;
  fullName: string;
  email: string;
  accommodation: Accommodation;
  // other fields like paymentMade can be added if needed for display or filtering
  paymentMade?: boolean;
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
  // Example: Adding a payment status column if needed
  // {
  //   accessorKey: "paymentMade",
  //   header: "Paid",
  //   cell: ({ row }) => {
  //     const isPaid = row.original.paymentMade;
  //     return isPaid ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>;
  //   },
  // },
];
