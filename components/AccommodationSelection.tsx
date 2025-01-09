import { useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  RegistrationFormData,
  accommodationOptions,
} from "@/schemas/registrationSchema";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export function AccommodationSelection() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<RegistrationFormData>();

  const accommodationType = watch("accommodation.type");

  const handleAccommodationChange = (value: string) => {
    setValue("accommodation.type", value, { shouldValidate: true });
  };

  const content = (
    <div className="space-y-4">
      <Label className="text-lg font-bold">Accommodation</Label>
      <RadioGroup
        value={accommodationType}
        onValueChange={handleAccommodationChange}
        className="space-y-2"
      >
        {accommodationOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2 p-2">
            <RadioGroupItem value={option.value} id={`accommodation-${option.value}`} />
            <Label htmlFor={`accommodation-${option.value}`}>
              {option.label} - €{option.price} per night
            </Label>
          </div>
        ))}
      </RadioGroup>
      {errors.accommodation?.type && (
        <p className="text-red-500 text-sm mt-1">
          {errors.accommodation.type.message}
        </p>
      )}
      <div className="mt-2">
        <Label htmlFor="nights">Number of nights</Label>
        <Input
          id="nights"
          type="number"
          min="1"
          max="5"
          {...register("accommodation.nights", { valueAsNumber: true })}
          className={errors.accommodation?.nights ? "border-red-500" : ""}
        />
        {errors.accommodation?.nights && (
          <p className="text-red-500 text-sm mt-1">
            {errors.accommodation.nights.message}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{content}</div>
      <Accordion type="single" collapsible className="md:hidden">
        <AccordionItem value="accommodation">
          <AccordionTrigger>Accommodation</AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

