import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import {
  registrationSchema,
  workshops,
  accommodationOptions,
  foodOptions,
  RegistrationFormData,
} from "@/schemas/registrationSchema";
import { ZodError } from "zod";

function calculateTotal(data: RegistrationFormData) {
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

  // Calculate accommodation total
  const selectedAccommodation = accommodationOptions.find(
    (a) => a.value === data.accommodation.type
  );
  if (selectedAccommodation) {
    total += selectedAccommodation.price * data.accommodation.nights;
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

    // Calculate total
    const total = calculateTotal(body);
    body.total = total;

    // Validate the data using Zod schema
    const validatedData = registrationSchema.parse(body);

    // Add default year if not provided
    const registrationData = {
      ...validatedData,
      year: validatedData.year || 2026,
    };

    // Create a new registration
    const registration = await Registration.create(registrationData);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: registration,
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
