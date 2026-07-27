import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Download, Check, Copy, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  RegistrationFormData,
  Workshop,
  workshops,
  accommodationOptions,
  foodOptions,
} from "@/schemas/registrationSchema";
import { maskIban, formatIban } from "@/lib/iban-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: RegistrationFormData;
  total: number;
  accommodationTotal: () => number;
  onDownloadReceipt: () => void;
  onSubmit: () => Promise<void>;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  formData,
  total,
  accommodationTotal,
  onDownloadReceipt,
  onSubmit,
}: ReceiptModalProps) {
  const t = useTranslations("receiptModal");
  const tForm = useTranslations("form");
  const tWorkshops = useTranslations("workshops");
  const tAccommodation = useTranslations("accommodation");
  const tFood = useTranslations("food");
  const tReceipt = useTranslations("receipt");
  const [paymentMade, setPaymentMade] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "done">(
    "idle"
  );
  const [iban, setIban] = useState("");
  const [ibanCopied, setIbanCopied] = useState(false);
  const [showFullIban, setShowFullIban] = useState(false);

  useEffect(() => {
    const fetchIban = async () => {
      const response = await fetch("/api/get-iban");
      const data = await response.json();
      setIban(data.iban);
    };

    fetchIban();
  }, []);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPaymentMade(false);
      setSubmitStatus("idle");
      setIbanCopied(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setSubmitStatus("loading");
    try {
      await onSubmit();
      setSubmitStatus("done");
      setTimeout(() => {
        setSubmitStatus("idle");
        onClose();
      }, 2000);
    } catch (error) {
      setSubmitStatus("idle");
      console.error("Submit error:", error);
    }
  };

  const includesAccommodation =
    formData.accommodation.type !== "already-booked" &&
    (formData.accommodation.type.includes("room") ||
      formData.accommodation.type === "bungalow");

  const initialPayment = useMemo(() => {
    return 100 + (includesAccommodation ? accommodationTotal() : 0);
  }, [includesAccommodation, accommodationTotal]);

  const remainingPayment = useMemo(() => {
    return total - initialPayment;
  }, [total, initialPayment]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[calc(100vh-2rem)] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>{t("name")}</strong> {formData.fullName}
          </div>
          <div>
            <strong>Email:</strong> {formData.email}
          </div>
          <div>
            <strong>{t("workshops")}</strong>
            <ul>
              {formData.workshops.map((workshopSelection) => {
                const workshop = workshops.find(
                  (w: Workshop) => w.id === workshopSelection.id
                );
                if (!workshop) return null;

                const price = workshop.levels
                  ? workshop.levels.find(
                      (l) => l.id === workshopSelection.level
                    )?.price
                  : workshop.price;

                return (
                  <li key={workshop.id}>
                    {tWorkshops(`items.${workshop.id}`)} - €{price}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <strong>{t("accommodation")}</strong>{" "}
            {tAccommodation(`options.${formData.accommodation.type}`)} - €
            {(accommodationOptions.find(
              (a) => a.value === formData.accommodation.type
            )?.price || 0) * formData.accommodation.nights}{" "}
            (
            {tAccommodation("nights", {
              count: formData.accommodation.nights,
            })}
            )
          </div>
          <div>
            <strong>{t("food")}</strong>{" "}
            {tFood(`options.${formData.food.type}`)} - €
            {(foodOptions.find((f) => f.value === formData.food.type)?.price ||
              0) * formData.food.days}{" "}
            ({tFood("days", { count: formData.food.days })})
          </div>
          <div>
            <strong>{t("children")}</strong>
            <ul>
              <li>
                {t("under5")}: {formData.children["under-5"]} x €0 = €0
              </li>
              <li>
                {t("age5to10")}: {formData.children["5-10"]} x €50 = €
                {formData.children["5-10"] * 50}
              </li>
              <li>
                {t("age10to17")}: {formData.children["10-17"]} x €80 = €
                {formData.children["10-17"] * 80}
              </li>
            </ul>
          </div>
          <div className="text-xl font-bold">
            {tReceipt("total")} €{total}
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <div className="font-semibold">{t("instructions")}</div>
            <div>{t("transferPrompt")}</div>
            <div className="font-bold">€{initialPayment}</div>
            <div className="text-sm">
              {includesAccommodation
                ? t("feeWithAccommodation", { amount: accommodationTotal() })
                : t("feeOnly")}
            </div>

            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="font-mono text-sm">
                  IBAN: {showFullIban ? formatIban(iban) : maskIban(iban)}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
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
                      <div>
                        {showFullIban
                          ? tReceipt("hideIban")
                          : tReceipt("showIban")}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          navigator.clipboard.writeText(iban);
                          setIbanCopied(true);
                          setTimeout(() => setIbanCopied(false), 2000);
                        }}
                      >
                        {ibanCopied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div>
                        {ibanCopied ? tReceipt("copied") : tReceipt("copyIban")}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {tReceipt("eyeHint")}
              </p>
            </div>
            <div>
              {tReceipt("nameLabel")} Carlos André Silva
              <br />
              {tReceipt("bankLabel")} N26
              <br />
              BIC: N26DEFFXXX
              <br />
              {tReceipt("referenceLabel")} {formData.fullName} + ADC2026
            </div>
            <div className="mt-4">
              {t("remaining", { amount: remainingPayment })}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="w-full space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="paymentMade"
                checked={paymentMade}
                onCheckedChange={(checked: boolean) => setPaymentMade(checked)}
              />
              <Label htmlFor="paymentMade">{tForm("paymentCheckbox")}</Label>
            </div>
            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={onDownloadReceipt}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                {tForm("downloadReceipt")}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!paymentMade || submitStatus !== "idle"}
                className="flex-1"
              >
                {submitStatus === "loading" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitStatus === "done" && <Check className="mr-2 h-4 w-4" />}
                {submitStatus === "idle"
                  ? tForm("submit")
                  : submitStatus === "loading"
                  ? tForm("submitting")
                  : tForm("submitted")}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
