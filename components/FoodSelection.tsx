import { useFormContext, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
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
import { translateZodMessage } from "@/lib/zod-i18n";

export function FoodSelection() {
  const t = useTranslations("food");
  const tZod = useTranslations("errors.zod");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RegistrationFormData>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const foodType = watch("food.type");
  const days = watch("food.days");

  const content = (
    <div className="space-y-4">
      {!isMobile && <Label className="text-lg font-bold">{t("title")}</Label>}
      <Controller
        name="food.type"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {foodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(`options.${option.value}`)} (€{option.price} {t("perDay")})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.food?.type && (
        <p className="text-red-500 text-sm mt-1">
          {typeof errors.food.type === "string"
            ? translateZodMessage(tZod, errors.food.type)
            : translateZodMessage(tZod, errors.food.type.message) ||
              t("errors.invalidType")}
        </p>
      )}
      <div className="mt-2">
        <Label htmlFor="days">{t("daysLabel")}</Label>
        <NumberInput
          id="days"
          min={1}
          max={5}
          value={days}
          onValueChange={(value) => setValue("food.days", value)}
        />
        {errors.food?.days && (
          <p className="text-red-500 text-sm mt-1">
            {typeof errors.food.days === "string"
              ? translateZodMessage(tZod, errors.food.days)
              : translateZodMessage(tZod, errors.food.days.message) ||
                t("errors.invalidDays")}
          </p>
        )}
      </div>
    </div>
  );

  return isMobile ? (
    <Accordion type="single" collapsible>
      <AccordionItem value="food">
        <AccordionTrigger className="text-md font-bold">
          {t("title")}
        </AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : (
    content
  );
}
