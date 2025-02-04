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
  accommodation: z.object({
    type: z.enum(["tent", "family-room", "single-room"]),
    nights: z
      .number()
      .int()
      .min(1, "Number of nights must be at least 1")
      .max(5, "Maximum number of nights is 5"),
  }),
  food: z.object({
    type: z.enum(["full", "single", "none"]),
    dietary: z.enum(["regular", "vegetarian", "vegan"]),
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
  total: z.number().int().min(0),
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
    name: "Djembe (10h)",
    levels: [
      { id: "intermediate", name: "Intermediate", price: 150 },
      { id: "advanced", name: "Advanced", price: 150 },
    ],
  },
  { id: "dance", name: "Dance (12h)", price: 130 },
  { id: "balafon", name: "Balafon (5h)", price: 60 },
];

export const accommodationOptions = [
  { value: "tent", label: "Tenda", price: 10 },
  {
    value: "family-room",
    label: "Quarto Família / Family Room (4 ppl)",
    price: 40,
    available: 6,
  },
  {
    value: "single-room",
    label: "Single (2ppl)",
    price: 40,
    available: 6,
  },
] as const;

export const foodOptions = [
  { value: "full", label: "3x Refeições/Meals", price: 35 },
  { value: "single", label: "1x Refeição/Meal", price: 15 },
  { value: "none", label: "No meals", price: 0 },
] as const;

export const dietaryOptions = [
  { value: "regular", label: "Regular" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
] as const;
