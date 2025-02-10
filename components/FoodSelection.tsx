import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
    register,
    formState: { errors },
    watch,
  } = useFormContext<RegistrationFormData>();

  const foodType = watch("food.type");

  const content = (
    <div className="space-y-4">
      {!isMobile && <Label className="text-lg font-bold">Comida / Food</Label>}
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
