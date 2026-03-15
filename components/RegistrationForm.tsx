"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Download, UserPlus, UserX } from "lucide-react";
import { downloadReceipt } from "@/utils/downloadReceipt";
import FloatingTotal from "./FloatingTotal";
import ReceiptModal from "./ReceiptModal";
import { PersonalInfo } from "./PersonalInfo";
import { WorkshopSelection } from "./WorkshopSelection";
import { AccommodationSelection } from "./AccommodationSelection";
import { FoodSelection } from "./FoodSelection";
import { ChildrenTickets } from "./ChildrenTickets";
import { Receipt } from "./Receipt";
import { AddRegistrantDialog } from "./AddRegistrantDialog";
import {
  RegistrationFormData,
  workshops,
  accommodationOptions,
  foodOptions,
  Workshop,
  AdditionalRegistrant,
} from "@/schemas/registrationSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ThankYouModal } from "./ThankYouModal";

export default function RegistrationForm() {
  const [total, setTotal] = useState(0);
  const [ibanCopied, setIbanCopied] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [isAddRegistrantOpen, setIsAddRegistrantOpen] = useState(false);

  const { watch, handleSubmit, setValue, reset } =
    useFormContext<RegistrationFormData>();
  const formData = watch();

  const children = {
    under5: formData.children["under-5"],
    age5to10: formData.children["5-10"],
    age10to17: formData.children["10-17"],
  };

  const additionalRegistrants = useMemo(
    () => formData.additionalRegistrants || [],
    [formData.additionalRegistrants]
  );

  const calculateTotal = useCallback(() => {
    let calculatedTotal = 0;
    
    // Primary registrant costs
    formData.workshops.forEach((workshopSelection) => {
      const workshop = workshops.find(
        (w: Workshop) => w.id === workshopSelection.id
      );
      if (workshop) {
        if (workshop.levels) {
          const level = workshop.levels.find(
            (l) => l.id === workshopSelection.level
          );
          if (level) calculatedTotal += level.price;
        } else if (workshop.price) {
          calculatedTotal += workshop.price;
        }
      }
    });
    
    const selectedAccommodation = accommodationOptions.find(
      (a) => a.value === formData.accommodation.type
    );
    if (selectedAccommodation)
      calculatedTotal +=
        selectedAccommodation.price * formData.accommodation.nights;
    const selectedFood = foodOptions.find(
      (f) => f.value === formData.food.type
    );
    if (selectedFood)
      calculatedTotal += selectedFood.price * formData.food.days;
    calculatedTotal += children.age5to10 * 50;
    calculatedTotal += children.age10to17 * 80;
    calculatedTotal += children.under5 * 0;

    // Additional registrants costs
    additionalRegistrants.forEach((registrant) => {
      // Workshops
      registrant.workshops.forEach((workshopSelection) => {
        const workshop = workshops.find(
          (w: Workshop) => w.id === workshopSelection.id
        );
        if (workshop) {
          if (workshop.levels) {
            const level = workshop.levels.find(
              (l) => l.id === workshopSelection.level
            );
            if (level) calculatedTotal += level.price;
          } else if (workshop.price) {
            calculatedTotal += workshop.price;
          }
        }
      });

      // Food (no accommodation - shared)
      const registrantFood = foodOptions.find(
        (f) => f.value === registrant.food.type
      );
      if (registrantFood) {
        calculatedTotal += registrantFood.price * registrant.food.days;
      }

      // Children
      calculatedTotal += registrant.children["5-10"] * 50;
      calculatedTotal += registrant.children["10-17"] * 80;
    });

    return calculatedTotal;
  }, [
    formData.workshops,
    formData.accommodation.type,
    formData.accommodation.nights,
    formData.food.type,
    formData.food.days,
    children.under5,
    children.age5to10,
    children.age10to17,
    additionalRegistrants,
  ]);

  useEffect(() => {
    const newTotal = calculateTotal();
    if (newTotal !== total) {
      setTotal(newTotal);
      setValue("total", newTotal);
    }
  }, [
    formData.workshops,
    formData.accommodation.type,
    formData.accommodation.nights,
    formData.food.type,
    formData.food.days,
    children.under5,
    children.age5to10,
    children.age10to17,
    additionalRegistrants,
    setValue,
    total,
    calculateTotal,
  ]);

  const handleAddRegistrant = (registrant: AdditionalRegistrant) => {
    const current = formData.additionalRegistrants || [];
    setValue("additionalRegistrants", [...current, registrant]);
  };

  const handleRemoveRegistrant = (index: number) => {
    const current = formData.additionalRegistrants || [];
    setValue(
      "additionalRegistrants",
      current.filter((_, i) => i !== index)
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setIbanCopied(true);
        setTimeout(() => setIbanCopied(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setSubmitStatus("loading");
    try {
      // Include total and paymentMade in the submission data
      const submissionData = {
        ...data,
        total: total,
        paymentMade: formData.paymentMade,
      };

      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      // If successful
      setSubmitStatus("done");
      setIsThankYouModalOpen(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
        reset();
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("idle");
      // You might want to show an error toast here
      alert("Failed to submit registration. Please try again.");
    }
  };

  const accommodationTotal = () => {
    const selectedAccommodation = accommodationOptions.find(
      (a) => a.value === formData.accommodation.type
    );
    return selectedAccommodation
      ? selectedAccommodation.price * formData.accommodation.nights
      : 0;
  };

  const handleDownloadReceipt = () => {
    downloadReceipt(
      "registration-receipt",
      `${formData.fullName.replace(/\s+/g, "-")}-receipt.png`
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Inscrição / Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <PersonalInfo />

                {/* Additional Registrants Section */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-bold">
                      Pessoas Adicionais / Additional People
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddRegistrantOpen(true)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Adicionar Pessoa
                    </Button>
                  </div>

                  {additionalRegistrants.length > 0 && (
                    <div className="space-y-2">
                      {additionalRegistrants.map((registrant, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{registrant.fullName}</p>
                            <p className="text-sm text-muted-foreground">
                              {registrant.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {registrant.workshops.length} workshop(s) | {" "}
                              {registrant.food.type !== "none"
                                ? `${registrant.food.type} food`
                                : "No food"}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRegistrant(index)}
                          >
                            <UserX className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <WorkshopSelection />
                <AccommodationSelection />
                <FoodSelection />
                <ChildrenTickets />
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="flex-1 hidden md:block">
          <Receipt
            formData={formData}
            total={total}
            ibanCopied={ibanCopied}
            copyToClipboard={copyToClipboard}
            handleDownloadReceipt={handleDownloadReceipt}
            paymentMade={formData.paymentMade}
            onPaymentMadeChange={(checked) => setValue("paymentMade", checked)}
          />
          <Card className="mt-4">
            <CardContent>
              <div className="flex items-center space-x-2 my-4">
                <Checkbox
                  id="paymentMade"
                  checked={formData.paymentMade}
                  onCheckedChange={(checked) => {
                    if (typeof checked === "boolean") {
                      setValue("paymentMade", checked);
                    }
                  }}
                />
                <Label htmlFor="paymentMade">
                  Li as instruções e efectuei pagamento / Read the instructions
                  and made the payment
                </Label>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={handleDownloadReceipt}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Recibo
                </Button>
              </div>

              <div className="mt-4">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!formData.paymentMade || submitStatus !== "idle"}
                  className="w-full"
                >
                  {submitStatus === "loading" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {submitStatus === "done" && (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  {submitStatus === "idle"
                    ? "Enviar"
                    : submitStatus === "loading"
                    ? "A enviar..."
                    : "Enviado"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <FloatingTotal
          total={total}
          onContinue={() => setIsReceiptModalOpen(true)}
        />
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          formData={formData}
          total={total}
          accommodationTotal={accommodationTotal}
          onDownloadReceipt={handleDownloadReceipt}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>

      <ThankYouModal
        isOpen={isThankYouModalOpen}
        onClose={() => setIsThankYouModalOpen(false)}
      />

      <AddRegistrantDialog
        isOpen={isAddRegistrantOpen}
        onClose={() => setIsAddRegistrantOpen(false)}
        onAdd={handleAddRegistrant}
      />
    </>
  );
}
