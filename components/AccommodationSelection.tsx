import { useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import {
  RegistrationFormData,
  accommodationOptions,
} from "@/schemas/registrationSchema";
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

  // const [roomAvailability, setRoomAvailability] = useState({
  //   'family-room': 6,
  //   'single-room': 6,
  // });

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setRoomAvailability({
  //       'family-room': Math.max(0, Math.floor(Math.random() * 7)),
  //       'single-room': Math.max(0, Math.floor(Math.random() * 7)),
  //     });
  //   }, 5000);
  //   return () => clearTimeout(timer);
  // }, []);

  const handleAccommodationChange = (
    value: "tent" | "family-room" | "single-room"
  ) => {
    setValue("accommodation.type", value);
    // Set nights to 5 automatically for room bookings
    if (value === "family-room" || value === "single-room") {
      setValue("accommodation.nights", 5);
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
        {accommodationOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}>
              {option.label} (€{option.price} per night)
              {(option.value === "family-room" ||
                option.value === "single-room") && (
                <span className="text-sm text-muted-foreground ml-1">
                  (5 nights only)
                </span>
              )}
            </Label>
          </div>
        ))}
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
            accommodationType === "single-room"
          }
        />
        {(accommodationType === "family-room" ||
          accommodationType === "single-room") && (
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
