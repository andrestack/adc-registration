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

export function FoodSelection() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<RegistrationFormData>();

  const foodType = watch("food.type");

  const content = (
    <div className="space-y-4">
      <Label className="text-lg font-bold">Food</Label>
      <Select {...register("food.type", { required: false })} value={foodType}>
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
        <p className="text-red-500 text-sm mt-1">{errors.food.type.message}</p>
      )}
      <div className="mt-2">
        <Label htmlFor="days">Number of days</Label>
        <Input
          id="days"
          type="number"
          max="5"
          {...register("food.days", { valueAsNumber: true, required: false })}
          className={errors.food?.days ? "border-red-500" : ""}
        />
        {errors.food?.days && (
          <p className="text-red-500 text-sm mt-1">
            {errors.food.days.message}
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
          <AccordionTrigger>Food</AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
