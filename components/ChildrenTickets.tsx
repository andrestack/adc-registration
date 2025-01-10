import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RegistrationFormData } from "@/schemas/registrationSchema";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FieldErrors } from "react-hook-form";

export function ChildrenTickets() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const content = (
    <div>
      <Label className="text-lg font-bold">Crianças / Children</Label>
      <div className="flex items-center space-y-2 mt-2">
        <div className="flex-1 space-y-2 items-center">
          <p>0-5 anos (free)</p>
          <p>5-10 anos (€50)</p>
          <p>10-17 anos (€80)</p>
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
          {Object.values(errors.children as FieldErrors)
            .map((error) => error?.message as string)
            .join(", ")}
        </p>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{content}</div>
      <Accordion type="single" collapsible className="md:hidden">
        <AccordionItem value="children-tickets">
          <AccordionTrigger>Children Tickets</AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
