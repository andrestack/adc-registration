import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RegistrationFormData } from "@/schemas/registrationSchema";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Accordion } from "@/components/ui/accordion";

export function PersonalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const content = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName" className="text-lg font-bold">
          Full Name
        </Label>
        <Input
          id="fullName"
          {...register("fullName")}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email" className="text-lg font-bold">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{content}</div>
      <Accordion type="single" collapsible className="md:hidden">
        <AccordionItem value="personal-info">
          <AccordionTrigger>Personal Information</AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

