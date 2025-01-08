import { useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  RegistrationFormData,
  accommodationOptions,
} from "@/schemas/registrationSchema";

export function AccommodationSelection() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<RegistrationFormData>();

  const accommodationType = watch("accommodation.type");

  return (
    <div className="space-y-4">
      <Label className="text-lg font-bold">Accommodation</Label>
      <RadioGroup
        {...register("accommodation.type")}
        className="space-y-2"
        value={accommodationType}
      >
        {accommodationOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2 p-2">
            <RadioGroupItem value={option.value} id={`accommodation-${option.value}`} />
            <Label htmlFor={`accommodation-${option.value}`}>
              {option.label} - €{option.price} per night
              {option.value !== "tent" && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {option.available} available
                </span>
              )}
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
          min="0"
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
}

