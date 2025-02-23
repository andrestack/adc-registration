import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { RegistrationFormData } from "@/schemas/registrationSchema";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "@/components/ui/accordion";
import { FieldErrors } from "react-hook-form";
import { useMediaQuery } from "@/hooks/use-media-query";

export function ChildrenTickets() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const under5 = watch("children.under-5");
  const age5to10 = watch("children.5-10");
  const age10to17 = watch("children.10-17");

  const content = (
    <div>
      {!isMobile && (
        <Label className="text-lg font-bold">Crianças / Children</Label>
      )}
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <Label>0-5 anos (free)</Label>
          <NumberInput
            value={under5}
            onValueChange={(value) => setValue("children.under-5", value)}
            min={0}
            max={10}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>5-10 anos (€50)</Label>
          <NumberInput
            value={age5to10}
            onValueChange={(value) => setValue("children.5-10", value)}
            min={0}
            max={10}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>10-17 anos (€80)</Label>
          <NumberInput
            value={age10to17}
            onValueChange={(value) => setValue("children.10-17", value)}
            min={0}
            max={10}
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

  return isMobile ? (
    <Accordion type="single" collapsible>
      <AccordionItem value="children">
        <AccordionTrigger className="text-md font-bold">
          Crianças / Children
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : (
    content
  );
}
