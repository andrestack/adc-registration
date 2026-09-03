import * as z from "zod";

export const sendEmailSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(255, "Subject must not exceed 255 characters"),
  body: z.string().min(1, "Body is required"),
  recipientEmails: z
    .array(
      z
        .string()
        .email("Invalid email address")
        .regex(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email format"
        )
    )
    .min(1, "At least one recipient is required"),
});

export type SendEmailRequest = z.infer<typeof sendEmailSchema>;
