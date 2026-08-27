import {
  workshops,
  accommodationOptions,
  foodOptions,
} from "@/schemas/registrationSchema";

export interface PaymentCsvRegistration {
  fullName: string;
  workshops: Array<{ id: string; level?: string }>;
  accommodation: {
    type: string;
    nights: number;
  };
  food: {
    type: string;
    days: number;
  };
  total: number;
}

const DEFAULT_INITIAL_PAYMENT = 100;

const HEADERS = [
  "Nome",
  "Dança",
  "Djembe",
  "Balafon",
  "Kora",
  "Refeição Completa",
  "Refeição Simples",
  "Tenda",
  "Bungalow Completo",
  "Quarto Individual",
  "Quarto Família",
  "Total",
  "Pago",
  "A Pagar",
];

function escapeCsvCell(value: string | number): string {
  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function getWorkshopPrice(workshopId: string): number {
  const workshop = workshops.find((w) => w.id === workshopId);
  if (!workshop) return 0;
  if (workshop.levels) {
    // All levels for a leveled workshop currently share the same price.
    return workshop.levels[0]?.price ?? 0;
  }
  return workshop.price ?? 0;
}

function hasWorkshop(
  selectedWorkshops: PaymentCsvRegistration["workshops"],
  workshopId: string
): boolean {
  return selectedWorkshops.some((w) => w.id === workshopId);
}

function getAccommodationPrice(type: string, nights: number): number {
  const option = accommodationOptions.find((a) => a.value === type);
  if (!option) return 0;
  return option.price * nights;
}

function getMealPrice(type: string, days: number): number {
  const option = foodOptions.find((f) => f.value === type);
  if (!option) return 0;
  return option.price * days;
}

export function generatePaymentsCSV(
  registrations: PaymentCsvRegistration[]
): string {
  const rows: (string | number)[][] = registrations.map((r) => {
    const dance = hasWorkshop(r.workshops, "dance")
      ? getWorkshopPrice("dance")
      : 0;
    const djembe = hasWorkshop(r.workshops, "djembe")
      ? getWorkshopPrice("djembe")
      : 0;
    const balafon = hasWorkshop(r.workshops, "balafon")
      ? getWorkshopPrice("balafon")
      : 0;
    const kora = hasWorkshop(r.workshops, "kora")
      ? getWorkshopPrice("kora")
      : 0;

    const mealFull =
      r.food.type === "full" ? getMealPrice("full", r.food.days) : 0;
    const mealSingle =
      r.food.type === "single" ? getMealPrice("single", r.food.days) : 0;

    const tent =
      r.accommodation.type === "tent"
        ? getAccommodationPrice("tent", r.accommodation.nights)
        : 0;
    const bungalowComplete =
      r.accommodation.type === "bungalow"
        ? getAccommodationPrice("bungalow", r.accommodation.nights)
        : 0;
    const bungalowSingleRoom =
      r.accommodation.type === "single-room"
        ? getAccommodationPrice("single-room", r.accommodation.nights)
        : 0;
    const bungalowFamilyRoom =
      r.accommodation.type === "family-room"
        ? getAccommodationPrice("family-room", r.accommodation.nights)
        : 0;

    const paid = DEFAULT_INITIAL_PAYMENT;
    const toBePaid = r.total - paid;

    return [
      r.fullName,
      dance,
      djembe,
      balafon,
      kora,
      mealFull,
      mealSingle,
      tent,
      bungalowComplete,
      bungalowSingleRoom,
      bungalowFamilyRoom,
      r.total,
      paid,
      toBePaid,
    ];
  });

  const totals: (number | string)[] = new Array(HEADERS.length).fill(0);
  for (const row of rows) {
    for (let i = 1; i < HEADERS.length; i++) {
      totals[i] = (totals[i] as number) + (row[i] as number);
    }
  }
  totals[0] = "TOTAIS";

  const csvLines = [
    HEADERS.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
    totals.map(escapeCsvCell).join(","),
  ];

  return csvLines.join("\n");
}
