import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RegistrationFormData,
  foodOptions,
} from "@/schemas/registrationSchema";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/use-media-query";

export function FoodSelection() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const foodType = watch("food.type");
  const days = watch("food.days");

  const content = (
    <div className="space-y-4">
      {!isMobile && <Label className="text-lg font-bold">Comida / Food</Label>}
      <Controller
        name="food.type"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select food option" />
            </SelectTrigger>
            <SelectContent>
              {foodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} (€{option.price} per day)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.food?.type && (
        <p className="text-red-500 text-sm mt-1">
          {typeof errors.food.type === "string"
            ? errors.food.type
            : errors.food.type.message || "Invalid food type"}
        </p>
      )}
      <div className="mt-2">
        <Label htmlFor="days">Número de dias / Number of days</Label>
        <NumberInput
          id="days"
          min={1}
          max={5}
          value={days}
          onValueChange={(value) => setValue("food.days", value)}
        />
        {errors.food?.days && (
          <p className="text-red-500 text-sm mt-1">
            {typeof errors.food.days === "string"
              ? errors.food.days
              : errors.food.days.message || "Invalid number of days"}
          </p>
        )}
      </div>
    </div>
  );

  return isMobile ? (
    <Accordion type="single" collapsible>
      <AccordionItem value="food">
        <AccordionTrigger>Comida / Food</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : (
    content
  );
}
