import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAccommodationAvailability } from "@/lib/accommodation-availability";

// Availability changes as bookings come in — never cache this response
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam) : 2026;

    const availability = await getAccommodationAvailability(year);

    return NextResponse.json({
      success: true,
      data: availability,
    });
  } catch (error) {
    console.error("Error fetching accommodation availability:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch accommodation availability",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
