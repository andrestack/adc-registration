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

// Schema for additional registrant (group member)
export const additionalRegistrantSchema = z.object({
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
  workshops: z.array(
    z.object({
      id: z.string(),
      level: z.string().optional(),
    })
  ),
  food: z.object({
    type: z.enum(["full", "single", "none"]),
    days: z
      .number()
      .int()
      .min(0, "Number of days must be at least 0")
      .max(5, "Maximum number of days is 5"),
  }),
  children: z.object({
    "under-5": z.number().int().min(0),
    "5-10": z.number().int().min(0),
    "10-17": z.number().int().min(0),
  }),
});

export type AdditionalRegistrant = z.infer<typeof additionalRegistrantSchema>;

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
  workshops: z.array(
    z.object({
      id: z.string(),
      level: z.string().optional(),
    })
  ),
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
      // Physical unit assignment (admin-only, set after booking)
      bungalowUnit: z.number().int().min(1).max(5).optional(),
      bungalowRoom: z.enum(["single", "family", "whole"]).optional(),
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
      .min(0, "Number of days must be at least 0")
      .max(5, "Maximum number of days is 5"),
  }),
  children: z.object({
    "under-5": z.number().int().min(0),
    "5-10": z.number().int().min(0),
    "10-17": z.number().int().min(0),
  }),
  paymentMade: z.boolean(),
  total: z.number().min(0, "Total amount must be greater than or equal to 0"),
  year: z.number().optional(),
  additionalRegistrants: z.array(additionalRegistrantSchema).optional(),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export type Workshop = {
  id: string;
  price?: number;
  levels?: Array<{ id: string; price: number }>;
};

// Display names are translations, not data: see messages/*.json under
// workshops.items / workshops.levels (ids are stored in MongoDB)
export const workshops: Workshop[] = [
  {
    id: "djembe",
    levels: [
      { id: "intermediate", price: 150 },
      { id: "advanced", price: 150 },
      { id: "beginner", price: 150 },
    ],
  },
  { id: "dance", price: 130 },
  { id: "balafon", price: 60 },
  { id: "kora", price: 60 },
];

// Labels live in messages/*.json under accommodation.options
export const accommodationOptions = [
  {
    value: "tent",
    price: 10,
    disabled: false,
    available: 100,
  },
  {
    value: "family-room",
    price: 45,
    disabled: false,
    available: 5,
  },
  {
    value: "single-room",
    price: 45,
    available: 5,
    disabled: false,
  },
  {
    value: "bungalow",
    price: 90,
    available: 5,
    disabled: false,
    fixedNights: 5,
  },
  {
    value: "already-booked",
    price: 0,
    disabled: false,
    available: 100,
  },
] as const;

// Add a type for accommodation options
export type AccommodationOption = {
  value: "tent" | "family-room" | "single-room" | "bungalow" | "already-booked";
  price: number;
  disabled: boolean;
  available: number;
  fixedNights?: number;
};

// Labels live in messages/*.json under food.options
export const foodOptions = [
  { value: "full", price: 35 },
  { value: "single", price: 15 },
] as const;
