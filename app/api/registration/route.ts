import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import {
  registrationSchema,
  additionalRegistrantSchema,
  workshops,
  accommodationOptions,
  foodOptions,
  RegistrationFormData,
  AdditionalRegistrant,
} from "@/schemas/registrationSchema";
import { ZodError } from "zod";
import { randomUUID } from "crypto";

function calculateIndividualTotal(data: RegistrationFormData | AdditionalRegistrant, includeAccommodation: boolean = true) {
  let total = 0;

  // Calculate workshops total
  data.workshops.forEach((workshopSelection) => {
    const workshop = workshops.find((w) => w.id === workshopSelection.id);
    if (workshop) {
      if (workshop.levels) {
        const level = workshop.levels.find(
          (l) => l.id === workshopSelection.level
        );
        if (level) total += level.price;
      } else if (workshop.price) {
        total += workshop.price;
      }
    }
  });

  // Calculate accommodation total (only for primary)
  if (includeAccommodation && 'accommodation' in data) {
    const selectedAccommodation = accommodationOptions.find(
      (a) => a.value === data.accommodation.type
    );
    if (selectedAccommodation) {
      total += selectedAccommodation.price * data.accommodation.nights;
    }
  }

  // Calculate food total
  const selectedFood = foodOptions.find((f) => f.value === data.food.type);
  if (selectedFood) {
    total += selectedFood.price * data.food.days;
  }

  // Calculate children tickets total
  total += data.children["5-10"] * 50;
  total += data.children["10-17"] * 80;
  total += data.children["under-5"] * 0;

  return total;
}

export async function POST(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await request.json();

    // Validate the primary registrant data
    const validatedData = registrationSchema.parse(body);

    // Check if there are additional registrants
    const additionalRegistrants = body.additionalRegistrants || [];
    const hasAdditionalRegistrants = additionalRegistrants.length > 0;

    // Generate booking group ID if there are additional registrants
    const bookingGroupId = hasAdditionalRegistrants ? randomUUID() : undefined;

    // Create registrations array to hold all registrations
    const createdRegistrations = [];

    // Calculate primary registrant total
    const primaryTotal = calculateIndividualTotal(validatedData, true);

    // Create primary registrant
    const primaryRegistrationData = {
      fullName: validatedData.fullName,
      email: validatedData.email,
      workshops: validatedData.workshops,
      accommodation: validatedData.accommodation,
      food: validatedData.food,
      children: validatedData.children,
      paymentMade: validatedData.paymentMade,
      total: primaryTotal,
      year: validatedData.year || 2026,
      bookingGroupId,
      isPrimaryBooking: true,
      primaryRegistrantName: undefined,
    };

    const primaryRegistration = await Registration.create(primaryRegistrationData);
    createdRegistrations.push(primaryRegistration);

    // Create additional registrants
    for (const additionalRegistrant of additionalRegistrants) {
      // Validate additional registrant
      const validatedAdditional = additionalRegistrantSchema.parse(additionalRegistrant);

      // Calculate their individual total (no accommodation cost - shared with primary)
      const additionalTotal = calculateIndividualTotal(validatedAdditional, false);

      const additionalRegistrationData = {
        fullName: validatedAdditional.fullName,
        email: validatedAdditional.email,
        workshops: validatedAdditional.workshops,
        accommodation: validatedData.accommodation, // Same accommodation as primary
        food: validatedAdditional.food,
        children: validatedAdditional.children,
        paymentMade: false, // Additional registrants don't make separate payments
        total: additionalTotal,
        year: validatedData.year || 2026,
        bookingGroupId,
        isPrimaryBooking: false,
        primaryRegistrantName: validatedData.fullName,
      };

      const additionalRegistration = await Registration.create(additionalRegistrationData);
      createdRegistrations.push(additionalRegistration);
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: hasAdditionalRegistrants
          ? "Group registration successful"
          : "Registration successful",
        data: {
          primary: createdRegistrations[0],
          additional: createdRegistrations.slice(1),
          totalRegistrations: createdRegistrations.length,
          bookingGroupId,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle validation errors
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

    // Handle other errors
    console.error("Registration error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration failed",
          error: error.message,
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "An unknown error occurred",
        },
        { status: 500 }
      );
    }
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Get year from query params, default to current year (2026)
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    const query = year ? { year: parseInt(year) } : {};

    const registrations = await Registration.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // Convert to plain JavaScript objects

    return NextResponse.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch registrations",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
