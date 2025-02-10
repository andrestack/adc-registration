import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import { registrationSchema } from "@/schemas/registrationSchema";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await request.json();

    // Validate the data using Zod schema
    const validatedData = registrationSchema.parse(body);

    // Create a new registration
    const registration = await Registration.create(validatedData);

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
