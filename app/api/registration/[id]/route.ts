import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { paymentMade } = body;

    const registration = await Registration.findByIdAndUpdate(
      params.id,
      { paymentMade },
      { new: true }
    );

    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment status updated successfully",
      data: registration,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update payment status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
