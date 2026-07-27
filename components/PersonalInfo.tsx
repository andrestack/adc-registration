import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
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
import { translateZodMessage } from "@/lib/zod-i18n";

export function PersonalInfo() {
  const t = useTranslations("form");
  const tZod = useTranslations("errors.zod");
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
            {t("fullName")}
          </Label>
        )}

        <Input
          placeholder={t("fullNamePlaceholder")}
          id="fullName"
          {...register("fullName")}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">
            {translateZodMessage(tZod, errors.fullName.message)}
          </p>
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
          <p className="text-red-500 text-sm mt-1">
            {translateZodMessage(tZod, errors.email.message)}
          </p>
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
            {t("nameAndEmail")}
          </AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
