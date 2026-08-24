import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";

const BUNGALOW_ROOMS = ["single", "family", "whole"] as const;
type BungalowRoom = (typeof BUNGALOW_ROOMS)[number];

// A "whole" booking occupies both the single and family slot of its unit,
// so it conflicts with any other booking on that unit; single/family only
// conflict with the same room or with a whole.
function roomsConflict(a: BungalowRoom, b: BungalowRoom) {
  if (a === "whole" || b === "whole") return true;
  return a === b;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      paymentMade,
      initialPayment,
      bungalowUnit,
      bungalowRoom,
      accommodationType,
    } = body;

    // Create update object based on provided fields
    const updateData: {
      paymentMade?: boolean;
      initialPayment?: number;
    } = {};
    const dotSet: Record<string, unknown> = {};
    const dotUnset: Record<string, ""> = {};

    const VALID_ACCOMMODATION_TYPES = [
      "tent",
      "family-room",
      "single-room",
      "bungalow",
      "already-booked",
    ] as const;

    if (typeof accommodationType !== "undefined") {
      if (
        !(VALID_ACCOMMODATION_TYPES as readonly string[]).includes(
          accommodationType
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid accommodation type: ${accommodationType}`,
          },
          { status: 400 }
        );
      }
      dotSet["accommodation.type"] = accommodationType;
    }
    if (typeof paymentMade !== "undefined")
      updateData.paymentMade = paymentMade;
    if (typeof initialPayment !== "undefined")
      updateData.initialPayment = initialPayment;

    const settingBungalow =
      typeof bungalowUnit !== "undefined" ||
      typeof bungalowRoom !== "undefined";

    if (settingBungalow) {
      const clearing = bungalowUnit === null && bungalowRoom === null;

      if (clearing) {
        dotUnset["accommodation.bungalowUnit"] = "";
        dotUnset["accommodation.bungalowRoom"] = "";
      } else {
        // Promoting to bungalow implies the whole unit; default room if omitted.
        const effectiveRoom: BungalowRoom =
          accommodationType === "bungalow" && typeof bungalowRoom === "undefined"
            ? "whole"
            : bungalowRoom;

        const validUnit =
          Number.isInteger(bungalowUnit) &&
          bungalowUnit >= 1 &&
          bungalowUnit <= 5;
        const validRoom = BUNGALOW_ROOMS.includes(effectiveRoom);

        if (!validUnit || !validRoom) {
          return NextResponse.json(
            {
              success: false,
              message:
                "bungalowUnit must be an integer 1-5 and bungalowRoom must be one of single/family/whole (or both null to clear)",
            },
            { status: 400 }
          );
        }

        const current = await Registration.findById(params.id);
        if (!current) {
          return NextResponse.json(
            { success: false, message: "Registration not found" },
            { status: 404 }
          );
        }

        const currentType = current.accommodation?.type;
        const finalType = accommodationType || currentType;
        if (!["bungalow", "single-room", "family-room"].includes(finalType)) {
          return NextResponse.json(
            {
              success: false,
              message: `Cannot assign a bungalow unit to a registration of type "${finalType}"`,
            },
            { status: 400 }
          );
        }

        // Additional registrants share the primary registrant's physical unit
        // (see lib/accommodation-availability.ts) — assigning them their own
        // unit would occupy a phantom slot the availability check never counts.
        if (current.isPrimaryBooking === false) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Additional registrants share the primary registrant's accommodation — assign the unit on the primary booking instead",
            },
            { status: 400 }
          );
        }

        // Conflict check against other primary bookings in the same year/unit
        const others = await Registration.find({
          _id: { $ne: params.id },
          year: current.year,
          isPrimaryBooking: { $ne: false },
          "accommodation.bungalowUnit": bungalowUnit,
        });

        const conflict = others.find((o) =>
          roomsConflict(o.accommodation.bungalowRoom, effectiveRoom)
        );

        if (conflict) {
          return NextResponse.json(
            {
              success: false,
              message: `Bungalow ${bungalowUnit} (${effectiveRoom}) conflicts with ${conflict.fullName}'s existing assignment (${conflict.accommodation.bungalowRoom})`,
            },
            { status: 409 }
          );
        }

        dotSet["accommodation.bungalowUnit"] = bungalowUnit;
        dotSet["accommodation.bungalowRoom"] = effectiveRoom;
      }
    }

    // MongoDB update docs can't mix plain top-level fields with operators
    // ($set/$unset), so fold everything into operator form once either is used.
    const usingOperators =
      Object.keys(dotSet).length > 0 || Object.keys(dotUnset).length > 0;

    const mongoUpdate: Record<string, unknown> = usingOperators
      ? {
          $set: { ...updateData, ...dotSet },
          ...(Object.keys(dotUnset).length ? { $unset: dotUnset } : {}),
        }
      : updateData;

    const registration = await Registration.findByIdAndUpdate(
      params.id,
      mongoUpdate,
      { new: true, runValidators: true }
    );

    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration updated successfully",
      data: registration,
    });
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update registration",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const registration = await Registration.findByIdAndDelete(params.id);

    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete registration",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
