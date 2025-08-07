import * as z from "zod";

// const workshopSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   price: z.number().optional(),
//   levels: z.array(z.object({
//     id: z.string(),
//     name: z.string(),
//     price: z.number(),
//   })).optional(),
// });

export const registrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .min(5, "Email must be at least 5 characters long")
    .max(255, "Email must not exceed 255 characters"),
  workshops: z
    .array(
      z.object({
        id: z.string(),
        level: z.string().optional(),
      })
    )
    .min(1, "Please select at least one workshop"),
  accommodation: z
    .object({
      type: z.enum([
        "tent",
        "family-room",
        "single-room",
        "bungalow",
        "already-booked",
      ]),
      nights: z.number().int().min(1).max(5),
    })
    .refine(
      (data) => {
        if (data.type === "bungalow") {
          return data.nights === 5;
        }
        return true;
      },
      {
        message: "Bungalows must be booked for exactly 5 nights",
        path: ["nights"], // This will show the error on the nights field
      }
    ),
  food: z.object({
    type: z.enum(["full", "single", "none"]),
    days: z
      .number()
      .int()
      .min(0, "Number of days must be at least 1")
      .max(5, "Maximum number of days is 5"),
  }),
  children: z.object({
    "under-5": z.number().int().min(0),
    "5-10": z.number().int().min(0),
    "10-17": z.number().int().min(0),
  }),
  paymentMade: z.boolean(),
  total: z.number().min(0, "Total amount must be greater than or equal to 0"),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export type Workshop = {
  id: string;
  name: string;
  price?: number;
  levels?: Array<{ id: string; name: string; price: number }>;
};

export const workshops: Workshop[] = [
  {
    id: "djembe",
    name: "Djembe (9h)",
    levels: [
      { id: "intermediate", name: "Intermediate", price: 150 },
      { id: "advanced", name: "Advanced", price: 150 },
      { id: "beginner", name: "Beginner", price: 150 },
    ],
  },
  { id: "dance", name: "Dance (12h)", price: 130 },
  { id: "balafon", name: "Balafon (4,5h)", price: 60 },
  { id: "kora", name: "Kora (4,5h)", price: 60 },
];

export const accommodationOptions = [
  {
    value: "tent",
    label: "Tenda/Van - por pessoa/per person",
    price: 10,
    disabled: false,
    available: 100,
  },
  {
    value: "family-room",
    label: "Quarto Família / Family Room (4 ppl) - ESGOTADO",
    price: 40,
    disabled: true,
    available: 0,
  },
  {
    value: "single-room",
    label: "Single (2 ppl) - ESGOTADO",
    price: 40,
    available: 0,
    disabled: true,
  },
  {
    value: "bungalow",
    label: "Bungalow (6 ppl) - ESGOTADO",
    price: 80,
    available: 0,
    disabled: true,
    fixedNights: 5,
  },
  {
    value: "already-booked",
    label: "Já tenho alojamento / I have already booked accommodation",
    price: 0,
    disabled: false,
    available: 100,
  },
] as const;

// Add a type for accommodation options
export type AccommodationOption = {
  value: "tent" | "family-room" | "single-room" | "bungalow" | "already-booked";
  label: string;
  price: number;
  disabled: boolean;
  available: number;
  fixedNights?: number;
};

export const foodOptions = [
  { value: "full", label: "3x Refeições/Meals", price: 35 },
  { value: "single", label: "1x Refeição/Meal", price: 15 },
] as const;
