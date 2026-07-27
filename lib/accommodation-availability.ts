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
 * a whole (6 ppl):
 * - A whole-bungalow booking consumes both rooms of one unit.
 * - A room booking consumes that room of one unit, and also blocks that
 *   unit from being sold as a whole.
 *
 * So for W whole, S single-room and F family-room primary bookings:
 *   singles left  = 5 - W - S
 *   families left = 5 - W - F
 *   wholes left   = 5 - W - S - F   (a whole needs a fully untouched unit)
 *
 * The whole-bungalow count is conservative: it assumes each room booking
 * sits in a different unit, so it never oversells.
 *
 * Only primary bookings count: additional registrants share the primary
 * registrant's accommodation.
 */
export const TOTAL_BUNGALOWS = 5;

export async function getAccommodationAvailability(
  year: number = 2026
): Promise<AccommodationAvailabilityMap> {
  const counts = await Registration.aggregate<{
    _id: AccommodationType;
    count: number;
  }>([
    // isPrimaryBooking may be missing on legacy documents; treat missing as primary
    { $match: { year, isPrimaryBooking: { $ne: false } } },
    { $group: { _id: "$accommodation.type", count: { $sum: 1 } } },
  ]);

  const booked = counts.reduce<Partial<Record<AccommodationType, number>>>(
    (acc, { _id, count }) => ({ ...acc, [_id]: count }),
    {}
  );

  const wholes = booked["bungalow"] ?? 0;
  const singles = booked["single-room"] ?? 0;
  const families = booked["family-room"] ?? 0;

  const singleRemaining = Math.max(0, TOTAL_BUNGALOWS - wholes - singles);
  const familyRemaining = Math.max(0, TOTAL_BUNGALOWS - wholes - families);
  const wholeRemaining = Math.max(
    0,
    TOTAL_BUNGALOWS - wholes - singles - families
  );

  return {
    tent: { booked: booked["tent"] ?? 0, available: true },
    "family-room": {
      booked: families,
      available: familyRemaining > 0,
      remaining: familyRemaining,
    },
    "single-room": {
      booked: singles,
      available: singleRemaining > 0,
      remaining: singleRemaining,
    },
    bungalow: {
      booked: wholes,
      available: wholeRemaining > 0,
      remaining: wholeRemaining,
    },
    "already-booked": {
      booked: booked["already-booked"] ?? 0,
      available: true,
    },
  };
}
