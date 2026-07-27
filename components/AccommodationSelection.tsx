import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import {
  RegistrationFormData,
  accommodationOptions,
} from "@/schemas/registrationSchema";
import { AccommodationAvailabilityMap } from "@/lib/accommodation-availability";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/use-media-query";

export function AccommodationSelection() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<RegistrationFormData>();

  const accommodationType = watch("accommodation.type");
  const nights = watch("accommodation.nights");

  const [availability, setAvailability] =
    useState<AccommodationAvailabilityMap | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch("/api/accommodation-availability?year=2026", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch availability: ${res.statusText}`);
        const json = await res.json();
        setAvailability(json.data);
      } catch (error) {
        // Fail open: options stay enabled and the server-side check in
        // POST /api/registration remains the source of truth
        console.error("Could not load accommodation availability:", error);
      }
    };
    fetchAvailability();
  }, []);

  const handleAccommodationChange = (
    value:
      | "tent"
      | "family-room"
      | "single-room"
      | "bungalow"
      | "already-booked"
  ) => {
    setValue("accommodation.type", value);
    // Set nights to 5 automatically for room and bungalow bookings
    if (
      value === "family-room" ||
      value === "single-room" ||
      value === "bungalow"
    ) {
      setValue("accommodation.nights", 5);
    } else if (value === "already-booked") {
      setValue("accommodation.nights", 1); // Set minimum nights for already booked
    }
  };

  const content = (
    <div className="space-y-4">
      {!isMobile && (
        <Label className="text-lg font-bold">Alojamento / Accommodation</Label>
      )}
      <RadioGroup
        value={accommodationType}
        onValueChange={handleAccommodationChange}
      >
        {accommodationOptions.map((option) => {
          const soldOut = availability
            ? !availability[option.value].available
            : false;
          const isDisabled = option.disabled || soldOut;
          return (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                disabled={isDisabled}
              />
              <Label
                htmlFor={option.value}
                className={
                  isDisabled ? "text-muted-foreground line-through" : ""
                }
              >
                {option.label} (€{option.price} per night)
                {(option.value === "family-room" ||
                  option.value === "single-room" ||
                  option.value === "bungalow") && (
                  <span className="text-sm text-muted-foreground ml-1">
                    (5 nights only)
                  </span>
                )}
                {soldOut && (
                  <span className="text-sm font-medium text-red-500 ml-1">
                    (esgotado / sold out)
                  </span>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      {errors.accommodation?.type && (
        <p className="text-red-500 text-sm mt-1">
          {typeof errors.accommodation.type === "string"
            ? errors.accommodation.type
            : errors.accommodation.type.message || "Invalid accommodation type"}
        </p>
      )}

      <div className="mt-4">
        <Label htmlFor="nights">Número de noites / Number of nights</Label>
        <NumberInput
          id="nights"
          min={1}
          max={5}
          value={nights}
          onValueChange={(value) => setValue("accommodation.nights", value)}
          disabled={
            accommodationType === "family-room" ||
            accommodationType === "single-room" ||
            accommodationType === "bungalow"
          }
        />
        {(accommodationType === "family-room" ||
          accommodationType === "single-room" ||
          accommodationType === "bungalow") && (
          <p className="text-sm text-muted-foreground mt-1">
            Reservas em bungalow só para 5 noites / Bungalow bookings are for 5
            nights only
          </p>
        )}
        {errors.accommodation?.nights && (
          <p className="text-red-500 text-sm mt-1">
            {typeof errors.accommodation.nights === "string"
              ? errors.accommodation.nights
              : errors.accommodation.nights.message ||
                "Invalid number of nights"}
          </p>
        )}
      </div>
    </div>
  );

  return isMobile ? (
    <Accordion type="single" collapsible>
      <AccordionItem value="accommodation">
        <AccordionTrigger className="text-md font-bold">
          Alojamento / Accommodation
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : (
    content
  );
}
