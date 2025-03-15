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
import { Loader2, Download, Check, Copy } from "lucide-react";
import {
  RegistrationFormData,
  Workshop,
  workshops,
  accommodationOptions,
  foodOptions,
} from "@/schemas/registrationSchema";
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
  const [paymentMade, setPaymentMade] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "done">(
    "idle"
  );
  const [iban, setIban] = useState("");
  const [ibanCopied, setIbanCopied] = useState(false);

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

  const initialPayment = useMemo(() => {
    return (
      100 +
      (formData.accommodation.type !== "already-booked" &&
      (formData.accommodation.type.includes("room") ||
        formData.accommodation.type === "bungalow")
        ? accommodationTotal()
        : 0)
    );
  }, [formData.accommodation.type, accommodationTotal]);

  const remainingPayment = useMemo(() => {
    return total - initialPayment;
  }, [total, initialPayment]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[calc(100vh-2rem)] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registration Receipt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>Nome:</strong> {formData.fullName}
          </div>
          <div>
            <strong>Email:</strong> {formData.email}
          </div>
          <div>
            <strong>Workshops:</strong>
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
                    {workshop.name} - €{price}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <strong>Accommodation/Alojamento:</strong>{" "}
            {
              accommodationOptions.find(
                (a) => a.value === formData.accommodation.type
              )?.label
            }{" "}
            - €
            {(accommodationOptions.find(
              (a) => a.value === formData.accommodation.type
            )?.price || 0) * formData.accommodation.nights}{" "}
            ({formData.accommodation.nights} nights)
          </div>
          <div>
            <strong>Food/Alimentação:</strong>{" "}
            {foodOptions.find((f) => f.value === formData.food.type)?.label} - €
            {(foodOptions.find((f) => f.value === formData.food.type)?.price ||
              0) * formData.food.days}{" "}
            ({formData.food.days} days)
          </div>
          <div>
            <strong>Children/Crianças:</strong>
            <ul>
              <li>under 5: {formData.children["under-5"]} x €0 = €0</li>
              <li>
                5-10 years: {formData.children["5-10"]} x €50 = €
                {formData.children["5-10"] * 50}
              </li>
              <li>
                10-17 years: {formData.children["10-17"]} x €80 = €
                {formData.children["10-17"] * 80}
              </li>
            </ul>
          </div>
          <div className="text-xl font-bold">Total: €{total}</div>

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <div className="font-semibold">Instructions/Instruções:</div>
            <div>
              Por favor transferir para confirmar/ please transfer this amount
              to confirm your booking:
            </div>
            <div className="font-bold">€{initialPayment}</div>
            <div className="text-sm">
              (€100 registration fee{" "}
              {(formData.accommodation.type.includes("room") ||
                formData.accommodation.type === "bungalow") &&
                `+ €${accommodationTotal()} for accommodation`}
              )
            </div>

            <div className="mt-2 flex items-center">
              <div>IBAN: {iban}</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
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
                    <div>{ibanCopied ? "Copied!" : "Copy IBAN"}</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              Nome: Carlos André Silva
              <br />
              Banco: N26
              <br />
              BIC: N26DEFFXXX
              <br />
              Referencia / Reference: {formData.fullName} + ADC2025
            </div>
            <div className="mt-4">
              Os restantes / The remaining amount of €{remainingPayment} devem
              ser pagos em dinheiro no local / to be paid in cash at the venue.
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
              <Label htmlFor="paymentMade">
                Li as instruções e efectuei pagamento
              </Label>
            </div>
            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={onDownloadReceipt}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Recibo
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
                  ? "Enviar"
                  : submitStatus === "loading"
                  ? "A enviar..."
                  : "Enviado"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
