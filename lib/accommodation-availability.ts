import Registration from "@/models/Registration";

export type AccommodationType =
  | "tent"
  | "family-room"
  | "single-room"
  | "bungalow"
  | "already-booked";

export interface AccommodationAvailability {
  booked: number;
  available: boolean;
  /** Units left — only set for the bungalow types */
  remaining?: number;
}

export type AccommodationAvailabilityMap = Record<
  AccommodationType,
  AccommodationAvailability
>;

/**
 * Physical model: FIVE bungalows, each made up of one family room (4 ppl)
 * and one single room (2 ppl). Each bungalow can be booked per-room or as
 * a whole (6 ppl). Guests ARE assigned to a specific physical unit
 * (accommodation.bungalowUnit, 1-5) and room slot (accommodation.bungalowRoom,
 * "single"/"family"/"whole") by the admin after booking — see
 * app/(admin)/admin/accommodation. A "whole" booking occupies both slots
 * of its unit.
 *
 * Availability is computed from actual per-unit occupancy for bookings
 * that already have a unit assigned. Bookings of a bungalow-related type
 * that do NOT yet have a unit assigned (the admin hasn't gotten to them)
 * are handled conservatively: each one could still land on any currently
 * free slot, so it's subtracted from every remaining count (single, family,
 * AND whole) rather than being packed into a specific unit. This can never
 * overbook, but note singleRemaining/familyRemaining/wholeRemaining are NOT
 * additive with each other (as before) — they're independent worst-case
 * counts, not partitions of the same pool.
 *
 * Only primary bookings count: additional registrants (isPrimaryBooking:
 * false) share the primary registrant's accommodation and never get their
 * own unit.
 */
export const TOTAL_BUNGALOWS = 5;

type BungalowRoom = "single" | "family" | "whole";

interface BungalowBookingRow {
  accommodation: {
    type: AccommodationType;
    bungalowUnit?: number;
    bungalowRoom?: BungalowRoom;
  };
}

export async function getAccommodationAvailability(
  year: number = 2026
): Promise<AccommodationAvailabilityMap> {
  const allBookings = await Registration.find(
    { year, isPrimaryBooking: { $ne: false } },
    { "accommodation.type": 1, "accommodation.bungalowUnit": 1, "accommodation.bungalowRoom": 1 }
  ).lean<BungalowBookingRow[]>();

  const tentCount = allBookings.filter(
    (r) => r.accommodation.type === "tent"
  ).length;
  const alreadyBookedCount = allBookings.filter(
    (r) => r.accommodation.type === "already-booked"
  ).length;

  const bungalowRelated = allBookings.filter((r) =>
    ["bungalow", "single-room", "family-room"].includes(r.accommodation.type)
  );

  // Per-unit occupancy grid, built only from bookings with a valid assigned
  // unit (1-5) and room. Anything else (missing/out-of-range) is treated as
  // unassigned rather than clamped, so bad data can't fabricate a false
  // occupancy collision.
  const occSingle = Array(TOTAL_BUNGALOWS + 1).fill(false);
  const occFamily = Array(TOTAL_BUNGALOWS + 1).fill(false);

  let unassignedCount = 0;
  let wholeBooked = 0;
  let singleBooked = 0;
  let familyBooked = 0;

  for (const row of bungalowRelated) {
    const { type, bungalowUnit, bungalowRoom } = row.accommodation;
    if (type === "bungalow") wholeBooked++;
    if (type === "single-room") singleBooked++;
    if (type === "family-room") familyBooked++;

    const validUnit =
      Number.isInteger(bungalowUnit) &&
      (bungalowUnit as number) >= 1 &&
      (bungalowUnit as number) <= TOTAL_BUNGALOWS;
    const validRoom =
      bungalowRoom === "single" ||
      bungalowRoom === "family" ||
      bungalowRoom === "whole";

    if (!validUnit || !validRoom) {
      unassignedCount++;
      continue;
    }

    const unit = bungalowUnit as number;
    if (bungalowRoom === "whole") {
      occSingle[unit] = true;
      occFamily[unit] = true;
    } else if (bungalowRoom === "single") {
      occSingle[unit] = true;
    } else {
      occFamily[unit] = true;
    }
  }

  let nSingleFree = 0;
  let nFamilyFree = 0;
  let nWholeFree = 0;
  for (let unit = 1; unit <= TOTAL_BUNGALOWS; unit++) {
    if (!occSingle[unit]) nSingleFree++;
    if (!occFamily[unit]) nFamilyFree++;
    if (!occSingle[unit] && !occFamily[unit]) nWholeFree++;
  }

  // Conservative reservation: an unassigned booking could still take any
  // free slot, so it's subtracted from all three counts independently.
  const singleRemaining = Math.max(0, nSingleFree - unassignedCount);
  const familyRemaining = Math.max(0, nFamilyFree - unassignedCount);
  const wholeRemaining = Math.max(0, nWholeFree - unassignedCount);

  return {
    tent: { booked: tentCount, available: true },
    "family-room": {
      booked: familyBooked,
      available: familyRemaining > 0,
      remaining: familyRemaining,
    },
    "single-room": {
      booked: singleBooked,
      available: singleRemaining > 0,
      remaining: singleRemaining,
    },
    bungalow: {
      booked: wholeBooked,
      available: wholeRemaining > 0,
      remaining: wholeRemaining,
    },
    "already-booked": {
      booked: alreadyBookedCount,
      available: true,
    },
  };
}
