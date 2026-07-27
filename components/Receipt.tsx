"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check, Users, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  RegistrationFormData,
  workshops,
  accommodationOptions,
  foodOptions,
  Workshop,
  AdditionalRegistrant,
} from "@/schemas/registrationSchema";
import { maskIban, formatIban } from "@/lib/iban-utils";
import { useState, useEffect } from "react";

interface ReceiptProps {
  formData: RegistrationFormData;
  total: number;
  ibanCopied: boolean;
  copyToClipboard: (text: string) => void;
  handleDownloadReceipt: () => void;
  paymentMade: boolean;
  onPaymentMadeChange: (checked: boolean) => void;
}

function calculatePersonTotal(
  person: RegistrationFormData | AdditionalRegistrant,
  includeAccommodation: boolean = false
): number {
  let total = 0;

  // Workshops
  person.workshops.forEach((workshopSelection) => {
    const workshop = workshops.find((w: Workshop) => w.id === workshopSelection.id);
    if (workshop) {
      if (workshop.levels) {
        const level = workshop.levels.find((l) => l.id === workshopSelection.level);
        if (level) total += level.price;
      } else if (workshop.price) {
        total += workshop.price;
      }
    }
  });

  // Accommodation (only if included)
  if (includeAccommodation && "accommodation" in person) {
    const selectedAccommodation = accommodationOptions.find(
      (a) => a.value === person.accommodation.type
    );
    if (selectedAccommodation) {
      total += selectedAccommodation.price * person.accommodation.nights;
    }
  }

  // Food
  const selectedFood = foodOptions.find((f) => f.value === person.food.type);
  if (selectedFood) {
    total += selectedFood.price * person.food.days;
  }

  // Children
  total += person.children["5-10"] * 50;
  total += person.children["10-17"] * 80;

  return total;
}

function PersonReceiptSection({
  person,
  index,
  isPrimary,
}: {
  person: RegistrationFormData | AdditionalRegistrant;
  index: number;
  isPrimary: boolean;
}) {
  const t = useTranslations("receipt");
  const tWorkshops = useTranslations("workshops");
  const tAccommodation = useTranslations("accommodation");
  const tFood = useTranslations("food");
  const personTotal = calculatePersonTotal(person, isPrimary);

  return (
    <div className="border-b pb-4 mb-4 last:border-0">
      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
        {isPrimary ? "1." : `${index + 1}.`} {person.fullName}
        {isPrimary && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
            {t("primaryBadge")}
          </span>
        )}
      </h3>

      <div className="ml-4 space-y-2 text-sm">
        {/* Workshops */}
        {person.workshops.length > 0 && (
          <div>
            <strong>{t("workshops")}</strong>
            <ul className="ml-2">
              {person.workshops.map((workshopSelection) => {
                const workshop = workshops.find(
                  (w: Workshop) => w.id === workshopSelection.id
                );
                if (workshop) {
                  if (workshop.levels) {
                    const level = workshop.levels.find(
                      (l) => l.id === workshopSelection.level
                    );
                    return level ? (
                      <li key={`${workshop.id}-${level.id}`}>
                        {tWorkshops(`items.${workshop.id}`)} (
                        {tWorkshops(`levels.${level.id}`)}) - €{level.price}
                      </li>
                    ) : null;
                  } else if (workshop.price) {
                    return (
                      <li key={workshop.id}>
                        {tWorkshops(`items.${workshop.id}`)} - €{workshop.price}
                      </li>
                    );
                  }
                }
                return null;
              })}
            </ul>
          </div>
        )}

        {/* Food */}
        {person.food.type !== "none" && (
          <p>
            <strong>{t("food")}</strong> {tFood(`options.${person.food.type}`)}{" "}
            - €
            {(foodOptions.find((f) => f.value === person.food.type)?.price || 0) *
              person.food.days}{" "}
            ({tFood("days", { count: person.food.days })})
          </p>
        )}

        {/* Children */}
        {(person.children["under-5"] > 0 ||
          person.children["5-10"] > 0 ||
          person.children["10-17"] > 0) && (
          <div>
            <strong>{t("children")}</strong>
            <ul className="ml-2">
              {person.children["under-5"] > 0 && (
                <li>
                  {t("under5")} {person.children["under-5"]} x €0 = €0
                </li>
              )}
              {person.children["5-10"] > 0 && (
                <li>
                  {t("age5to10")} {person.children["5-10"]} x €50 = €
                  {person.children["5-10"] * 50}
                </li>
              )}
              {person.children["10-17"] > 0 && (
                <li>
                  {t("age10to17")} {person.children["10-17"]} x €80 = €
                  {person.children["10-17"] * 80}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Accommodation (only for primary) */}
        {isPrimary && "accommodation" in person && (
          <p>
            <strong>{t("accommodation")}</strong>{" "}
            {tAccommodation(`options.${person.accommodation.type}`)} - €
            {(accommodationOptions.find(
              (a) => a.value === person.accommodation.type
            )?.price || 0) * person.accommodation.nights}{" "}
            ({tAccommodation("nights", { count: person.accommodation.nights })})
          </p>
        )}

        <p className="font-semibold text-right">
          {t("subtotal")} €{personTotal}
        </p>
      </div>
    </div>
  );
}

export function Receipt({
  formData,
  total,
  ibanCopied,
  copyToClipboard,
}: ReceiptProps) {
  const t = useTranslations("receipt");
  const [iban, setIban] = useState("");
  const [showFullIban, setShowFullIban] = useState(false);

  useEffect(() => {
    const fetchIban = async () => {
      const response = await fetch("/api/get-iban");
      const data = await response.json();
      setIban(data.iban);
    };

    fetchIban();
  }, []);

  const additionalRegistrants = formData.additionalRegistrants || [];
  const totalPeople = 1 + additionalRegistrants.length;
  const isGroupBooking = totalPeople > 1;

  const displayIban = showFullIban ? formatIban(iban) : maskIban(iban);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t("title")}
          {isGroupBooking && (
            <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" />
              {t("people", { count: totalPeople })}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div id="registration-receipt" className="space-y-4">
          {/* Primary Registrant */}
          <PersonReceiptSection
            person={formData}
            index={0}
            isPrimary={true}
          />

          {/* Additional Registrants */}
          {additionalRegistrants.map((registrant, index) => (
            <PersonReceiptSection
              key={index}
              person={registrant}
              index={index + 1}
              isPrimary={false}
            />
          ))}

          <p className="text-xl font-bold border-t pt-4">
            {t("total")} €{total}
          </p>

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <p className="font-semibold">{t("instructions")}</p>
            <p>{t("transferPrompt")}</p>
            <p className="font-bold text-2xl">€{total}</p>
            {isGroupBooking && (
              <p className="text-sm text-muted-foreground">
                {t("totalForPeople", { count: totalPeople })}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2">
              <p className="font-mono">IBAN: {displayIban}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowFullIban(!showFullIban)}
                    >
                      {showFullIban ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showFullIban ? t("hideIban") : t("showIban")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(iban)}
                    >
                      {ibanCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{ibanCopied ? t("copied") : t("copyIban")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{t("eyeHint")}</p>
            <p className="mt-2 text-sm">
              <strong>{t("nameLabel")}</strong> Carlos André Silva
              <br />
              <strong>{t("bankLabel")}</strong> N26
              <br />
              <strong>BIC:</strong> NTSBDEB1XXX
              <br />
              <strong>{t("referenceLabel")}</strong> {formData.fullName} +
              ADC2026
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("sendReceiptNote")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
