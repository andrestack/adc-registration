import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RegistrationFormData } from "@/schemas/registrationSchema";

export function ChildrenTickets() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  return (
    <div>
      <Label className="text-lg font-bold">Children Tickets</Label>
      <div className="flex items-center space-y-2 mt-2">
        <div className="flex-1 space-y-2 items-center">
          <p>Under 5 (free)</p>
          <p>5-10 years old (€50 each)</p>
          <p>10-17 years old (€80 each)</p>
        </div>
        <div className="w-24 space-y-2">
          <Input
            id="children-under-5"
            type="number"
            min="0"
            {...register("children.under-5", { valueAsNumber: true })}
          />
          <Input
            id="children-5-10"
            type="number"
            min="0"
            {...register("children.5-10", { valueAsNumber: true })}
          />
          <Input
            id="children-10-17"
            type="number"
            min="0"
            {...register("children.10-17", { valueAsNumber: true })}
          />
        </div>
      </div>
      {errors.children && (
        <p className="text-red-500 text-sm mt-1">
          {Object.values(errors.children)
            .map((error) => error?.message)
            .join(", ")}
        </p>
      )}
    </div>
  );
}

