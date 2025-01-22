import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RegistrationFormData } from "@/schemas/registrationSchema";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Accordion } from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/use-media-query";

export function PersonalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const content = (
    <div className="space-y-4">
      <div>
        {!isMobile && (
          <Label htmlFor="fullName" className="text-lg font-bold">
            Nome Completo / Full Name
          </Label>
        )}

        <Input
          placeholder="Nome"
          id="fullName"
          {...register("fullName")}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>
      <div>
        {!isMobile && (
          <Label htmlFor="email" className="text-lg font-bold">
            Email
          </Label>
        )}

        <Input
          placeholder="Email"
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
          <AccordionTrigger className="text-md font-bold">
            Nome & Email
          </AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
