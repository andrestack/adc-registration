import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import { sendEmailSchema } from "@/schemas/emailSchema";
import { ZodError } from "zod";

const DEFAULT_EMAIL_YEAR = 2026;

interface Participant {
  _id: string;
  fullName: string;
  email: string;
}

/**
 * Fetches participants for the requested year and deduplicates by email.
 * Keeps the first document for each email so primary registrants win.
 */
async function getParticipants(year: number): Promise<Participant[]> {
  await dbConnect();

  const registrations = await Registration.find({ year })
    .sort({ createdAt: -1 })
    .lean();

  const seen = new Set<string>();
  const participants: Participant[] = [];

  for (const registration of registrations) {
    const email = String(registration.email || "").toLowerCase().trim();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    participants.push({
      _id: String(registration._id),
      fullName: String(registration.fullName || ""),
      email,
    });
  }

  return participants;
}

/**
 * GET /api/email?year=2026
 *
 * Returns a deduplicated list of participants for the given year.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : DEFAULT_EMAIL_YEAR;

    if (Number.isNaN(year)) {
      return NextResponse.json(
        { success: false, message: "Invalid year parameter" },
        { status: 400 }
      );
    }

    const participants = await getParticipants(year);

    return NextResponse.json({
      success: true,
      data: participants,
      count: participants.length,
    });
  } catch (error) {
    console.error("Error fetching email participants:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch participants",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/email
 *
 * Accepts a composed email plus a list of recipient emails, validates that each
 * recipient exists in the 2026 participant pool, then forwards a single payload
 * to n8n via webhook so the n8n SMTP node can send the messages.
 *
 * Payload forwarded to n8n:
 * {
 *   subject: string,
 *   body: string,
 *   recipients: string[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = sendEmailSchema.parse(body);

    // Only allow emails to go to participants in the current year pool.
    const participants = await getParticipants(DEFAULT_EMAIL_YEAR);
    const allowedEmails = new Set(participants.map((p) => p.email));

    const invalidRecipients = validated.recipientEmails.filter(
      (email) => !allowedEmails.has(email.toLowerCase().trim())
    );

    if (invalidRecipients.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more recipients are not registered participants",
          invalidRecipients,
        },
        { status: 400 }
      );
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Email service is not configured (N8N_WEBHOOK_URL missing)",
        },
        { status: 503 }
      );
    }

    const n8nHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const apiKey = process.env.N8N_WEBHOOK_API_KEY;
    if (apiKey) {
      n8nHeaders["Authorization"] = `Bearer ${apiKey}`;
    }

    const n8nPayload = {
      subject: validated.subject,
      body: validated.body,
      recipients: validated.recipientEmails.map((email) =>
        email.toLowerCase().trim()
      ),
    };

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: n8nHeaders,
      body: JSON.stringify(n8nPayload),
    });

    if (!n8nResponse.ok) {
      const n8nText = await n8nResponse.text();
      console.error("n8n webhook error:", n8nResponse.status, n8nText);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to queue email via automation service",
          details: n8nText,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email queued successfully",
      recipientCount: n8nPayload.recipients.length,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
