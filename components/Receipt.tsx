import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";
import {
  RegistrationFormData,
  workshops,
  accommodationOptions,
  foodOptions,
  Workshop,
} from "@/schemas/registrationSchema";

interface ReceiptProps {
  formData: RegistrationFormData;
  total: number;
  ibanCopied: boolean;
  copyToClipboard: (text: string) => void;
  accommodationTotal: () => number;
  handleDownloadReceipt: () => void;
  paymentMade: boolean;
  onPaymentMadeChange: (checked: boolean) => void;
}

export function Receipt({
  formData,
  total,
  ibanCopied,
  copyToClipboard,
  accommodationTotal,
}: ReceiptProps) {
  
  const iban = process.env.NEXT_PUBLIC_IBAN || "";
  
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Recibo / Receipt</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="registration-receipt" className="space-y-4">
          <p>
            <strong>Nome Completo:</strong> {formData.fullName}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <div>
            <strong>Workshops:</strong>
            <ul>
              {formData.workshops.map((workshopSelection) => {
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
                        {workshop.name} ({level.name}) - €{level.price}
                      </li>
                    ) : null;
                  } else if (workshop.price) {
                    return (
                      <li key={workshop.id}>
                        {workshop.name} - €{workshop.price}
                      </li>
                    );
                  }
                }
                return null;
              })}
            </ul>
          </div>
          <p>
            <strong>Alojamento:</strong>{" "}
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
          </p>
          <p>
            <strong>Comida:</strong>{" "}
            {foodOptions.find((f) => f.value === formData.food.type)?.label} - €
            {(foodOptions.find((f) => f.value === formData.food.type)?.price ||
              0) * formData.food.days}{" "}
            ({formData.food.days} days)
          </p>
          <p>
            <strong>Crianças / Children Tickets:</strong>
          </p>
          <ul>
            <li>
              under 5: {formData.children["under-5"]} x €0 = €
              {formData.children["under-5"] * 0}
            </li>
            <li>
              5-10 years: {formData.children["5-10"]} x €50 = €
              {formData.children["5-10"] * 50}
            </li>
            <li>
              10-17 years: {formData.children["10-17"]} x €80 = €
              {formData.children["10-17"] * 80}
            </li>
          </ul>
          <p className="text-xl font-bold">Total: €{total}</p>

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <p className="font-semibold">Instruções / Instructions:</p>
            <p>
              Por favor transfira o seguinte valor para confirmar a sua
              inscrição:
            </p>
            <p className="italic">
              Please transfer the following amount to confirm your booking:
            </p>
            <p className="font-bold">
              €
              {100 +
                (formData.accommodation.type.includes("room")
                  ? accommodationTotal()
                  : 0)}
            </p>
            <p className="text-sm">
              (€100 taxa de inscrição / registration fee{" "}
              {formData.accommodation.type.includes("room") &&
                `+ €${accommodationTotal()} para o alojamento`}
              )
            </p>
            <div className="mt-2 flex items-center">
              <p>IBAN: {iban}</p>
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
                    <p>{ibanCopied ? "Copied!" : "Copy IBAN"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p>
              Nome: Carlos Silva
              <br />
              Banco: N26
              <br />
              BIC: NTSBDEB1XXX
              <br />
              Referencia / Reference: {formData.fullName} + ADC2025
            </p>
            <p className="mt-4">
              Os restantes / The remaining amount of €
              {total -
                100 -
                (formData.accommodation.type.includes("room")
                  ? accommodationTotal()
                  : 0)}{" "}
              devem ser pagos em dinheiro no local / to be paid in cash at the
              venue.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
