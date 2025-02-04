import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  dietaryOptions,
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
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<RegistrationFormData>();

  const foodType = watch("food.type");
  const dietary = watch("food.dietary");
  const content = (
    <div className="space-y-4">
      {!isMobile && <Label className="text-lg font-bold">Comida / Food</Label>}

      <div className="space-y-2">
        <Label>Dietary Preference / Preferência Alimentar</Label>
        <RadioGroup
          value={dietary || ""}
          onValueChange={(value) => {
            setValue("food.dietary", value, { shouldValidate: true });
          }}
          className="flex flex-row space-x-4"
        >
          {dietaryOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`dietary-${option.value}`}
              />
              <Label htmlFor={`dietary-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {errors.food?.dietary && (
          <p className="text-red-500 text-sm">
            {errors.food.dietary.message ||
              "Please select a dietary preference"}
          </p>
        )}
      </div>

      <Select {...register("food.type")} value={foodType}>
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
      {errors.food?.type && (
        <p className="text-red-500 text-sm mt-1">
          {typeof errors.food.type === "string"
            ? errors.food.type
            : errors.food.type.message || "Invalid food type"}
        </p>
      )}

      <div className="mt-2">
        <Label htmlFor="days">Número de dias / Number of days</Label>
        <Input
          id="days"
          type="number"
          min="1"
          max="5"
          {...register("food.days", { valueAsNumber: true })}
          className={errors.food?.days ? "border-red-500" : ""}
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

  return (
    <>
      <div className="hidden md:block">{content}</div>
      <Accordion type="single" collapsible className="md:hidden">
        <AccordionItem value="food">
          <AccordionTrigger className="text-md font-bold">
            Comida / Food
          </AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
