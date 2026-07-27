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
}

export type AccommodationAvailabilityMap = Record<
  AccommodationType,
  AccommodationAvailability
>;

/**
 * Computes accommodation availability for a given year.
 *
 * Physical model: there is ONE bungalow, made up of one family room (4 ppl)
 * and one single room (2 ppl). It can be booked per-room or as a whole:
 * - If the family room OR the single room is booked, the whole-bungalow
 *   option is sold out (and each room sells out individually).
 * - If the whole bungalow is booked, both room options are sold out.
 *
 * Only primary bookings count: additional registrants share the primary
 * registrant's accommodation.
 */
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

  const familyRoomBooked = (booked["family-room"] ?? 0) > 0;
  const singleRoomBooked = (booked["single-room"] ?? 0) > 0;
  const bungalowBooked = (booked["bungalow"] ?? 0) > 0;

  return {
    tent: { booked: booked["tent"] ?? 0, available: true },
    "family-room": {
      booked: booked["family-room"] ?? 0,
      available: !familyRoomBooked && !bungalowBooked,
    },
    "single-room": {
      booked: booked["single-room"] ?? 0,
      available: !singleRoomBooked && !bungalowBooked,
    },
    bungalow: {
      booked: booked["bungalow"] ?? 0,
      available: !familyRoomBooked && !singleRoomBooked && !bungalowBooked,
    },
    "already-booked": {
      booked: booked["already-booked"] ?? 0,
      available: true,
    },
  };
}
