import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  RegistrationFormData,
  workshops,
  Workshop,
} from "@/schemas/registrationSchema";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/use-media-query";




export function WorkshopSelection() {
  const {
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<RegistrationFormData>();

  const selectedWorkshops = watch("workshops");

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleWorkshopChange = (
    workshopId: string,
    checked: boolean,
    level?: string
  ) => {
    let updatedWorkshops = [...selectedWorkshops];
    if (checked) {
      if (level) {
        updatedWorkshops = updatedWorkshops.filter((w) => w.id !== workshopId);
        updatedWorkshops.push({ id: workshopId, level });
      } else if (!updatedWorkshops.some((w) => w.id === workshopId)) {
        updatedWorkshops.push({ id: workshopId });
      }
    } else {
      updatedWorkshops = updatedWorkshops.filter((w) => w.id !== workshopId);
    }
    setValue("workshops", updatedWorkshops, { shouldValidate: true });
  };

  const content = (
    <div>
      {!isMobile && (
        <Label className="text-lg font-bold">Workshops</Label>
      )}

      <div className="space-y-4 mx-2">
        {workshops.map((workshop: Workshop) => (
          <div key={workshop.id} className="space-y-2">
            {workshop.levels ? (
              <div className="flex flex-col gap-2">
                <Label className="text-lg font-bold">{workshop.name}</Label>
                <RadioGroup
                  onValueChange={(value) =>
                    handleWorkshopChange(workshop.id, true, value)
                  }
                  value={
                    selectedWorkshops.find((w) => w.id === workshop.id)
                      ?.level || ""
                  }
                >
                  {workshop.levels.map((level) => (
                    <div key={level.id} className="flex items-center space-x-2 mx-2">
                      <RadioGroupItem
                        value={level.id}
                        id={`workshop-${workshop.id}-${level.id}`}
                      />
                      <Label htmlFor={`workshop-${workshop.id}-${level.id}`}>
                        {level.name} - €{level.price}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`workshop-${workshop.id}`}
                  checked={selectedWorkshops.some((w) => w.id === workshop.id)}
                  onCheckedChange={(checked) =>
                    handleWorkshopChange(workshop.id, checked as boolean)
                  }
                />
                <Label htmlFor={`workshop-${workshop.id}`}>
                  {workshop.name} - €{workshop.price}
                </Label>
              </div>
            )}
          </div>
        ))}
      </div>
      {errors.workshops && (
        <p className="text-red-500 text-sm mt-1">{errors.workshops.message}</p>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{content}</div>
      <Accordion type="single" collapsible className="md:hidden">
        <AccordionItem value="workshops">
          <AccordionTrigger className="text-md font-bold">
            Workshops
          </AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
