// Maps known zod validation messages (from schemas/registrationSchema.ts)
// to translation keys under errors.zod. Unknown messages pass through as-is,
// so the schema keeps working for API validation (English fallback).

const ZOD_MESSAGE_KEYS: Record<string, string> = {
  "Full name is required": "fullNameRequired",
  "Invalid email address": "emailInvalid",
  "Invalid email format": "emailFormat",
  "Email must be at least 5 characters long": "emailTooShort",
  "Email must not exceed 255 characters": "emailTooLong",
  "Number of days must be at least 0": "daysMin",
  "Maximum number of days is 5": "daysMax",
  "Bungalows must be booked for exactly 5 nights": "bungalowFiveNights",
  "Total amount must be greater than or equal to 0": "totalMin",
};

export function translateZodMessage(
  t: (key: string) => string,
  message: string | undefined
): string {
  if (!message) return "";
  const key = ZOD_MESSAGE_KEYS[message];
  return key ? t(key) : message;
}
