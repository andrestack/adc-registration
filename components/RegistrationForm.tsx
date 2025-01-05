"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { downloadReceipt } from "@/utils/downloadReceipt";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FloatingTotal from "./FloatingTotal";
import ReceiptModal from "./ReceiptModal";

const workshops = [
  { id: "djembe", name: "Djembe (10h - Advanced or Intermediate)", price: 150 },
  { id: "dance", name: "Dance (12h)", price: 130 },
  { id: "balafon", name: "Balafon (5h)", price: 60 },
];

const accommodationOptions = [
  { value: "tent", label: "Tent", price: 15 },
  {
    value: "family-room",
    label: "Family Room (fits 4)",
    price: 80,
    available: 6,
  },
  {
    value: "single-room",
    label: "Single Room (fits 2)",
    price: 60,
    available: 6,
  },
];

const foodOptions = [
  { value: "full", label: "Full catering", price: 30 },
  { value: "single", label: "Single meal", price: 15 },
];

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    workshops: [],
    accommodation: { type: "", nights: 0 },
    food: { type: "", days: 0 },
    children: { "under-5": 0, "5-10": 0, "10-17": 0 },
    paymentMade: false,
  });
  const [total, setTotal] = useState(0);
  const [ibanCopied, setIbanCopied] = useState(false);
  const [roomAvailability, setRoomAvailability] = useState({
    "family-room": 6,
    "single-room": 6,
  });
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");

  useEffect(() => {
    calculateTotal();
  }, [formData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRoomAvailability({
        "family-room": Math.max(0, Math.floor(Math.random() * 7)),
        "single-room": Math.max(0, Math.floor(Math.random() * 7)),
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleWorkshopChange = (workshopId, checked) => {
    setFormData((prev) => ({
      ...prev,
      workshops: checked
        ? [...prev.workshops, workshopId]
        : prev.workshops.filter((id) => id !== workshopId),
    }));
  };

  const handleAccommodationChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      accommodation: { ...prev.accommodation, type },
    }));
  };

  const handleFoodChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      food: { ...prev.food, type },
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    formData.workshops.forEach((workshopId) => {
      const workshop = workshops.find((w) => w.id === workshopId);
      if (workshop) total += workshop.price;
    });
    const selectedAccommodation = accommodationOptions.find(
      (a) => a.value === formData.accommodation.type
    );
    if (selectedAccommodation)
      total += selectedAccommodation.price * formData.accommodation.nights;
    const selectedFood = foodOptions.find(
      (f) => f.value === formData.food.type
    );
    if (selectedFood) total += selectedFood.price * formData.food.days;
    total += formData.children["5-10"] * 50;
    total += formData.children["10-17"] * 80;
    total += formData.children["under-5"] * 0;
    setTotal(total);
  };

  const copyToClipboard = (text) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", formData, "Total:", total);
    setSubmitStatus("done");
    setTimeout(() => setSubmitStatus("idle"), 2000);
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
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Drum and Dance Workshop Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="md:hidden">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="personal-info">
                  <AccordionTrigger>Personal Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName" className="text-lg font-bold">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-lg font-bold">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="workshops">
                  <AccordionTrigger>Workshops</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {workshops.map((workshop) => (
                        <div
                          key={workshop.id}
                          className="flex items-center space-x-2 p-2"
                        >
                          <Checkbox
                            id={`workshop-${workshop.id}`}
                            checked={formData.workshops.includes(workshop.id)}
                            onCheckedChange={(checked) =>
                              handleWorkshopChange(workshop.id, checked)
                            }
                          />
                          <Label htmlFor={`workshop-${workshop.id}`}>
                            {workshop.name} - €{workshop.price}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="accommodation">
                  <AccordionTrigger>Accommodation</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <RadioGroup
                        value={formData.accommodation.type}
                        onValueChange={handleAccommodationChange}
                        className="space-y-2"
                      >
                        {accommodationOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2 p-2"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={`accommodation-${option.value}`}
                            />
                            <Label htmlFor={`accommodation-${option.value}`}>
                              {option.label} - €{option.price} per night
                              {option.value !== "tent" && (
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {roomAvailability[option.value]} available
                                </span>
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <div>
                        <Label htmlFor="nights">Number of nights</Label>
                        <Input
                          id="nights"
                          name="nights"
                          type="number"
                          min="0"
                          value={formData.accommodation.nights}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              accommodation: {
                                ...prev.accommodation,
                                nights: parseInt(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="food">
                  <AccordionTrigger>Food</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Select
                        name="food"
                        value={formData.food.type}
                        onValueChange={handleFoodChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select food option" />
                        </SelectTrigger>
                        <SelectContent>
                          {foodOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label} (€{option.price} per day)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div>
                        <Label htmlFor="days">Number of days</Label>
                        <Input
                          id="days"
                          name="days"
                          type="number"
                          min="0"
                          value={formData.food.days}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              food: {
                                ...prev.food,
                                days: parseInt(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="children-tickets">
                  <AccordionTrigger>Children Tickets</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-center space-y-2">
                      <div className="flex-1 space-y-2 items-center">
                        <p>Under 5 (free)</p>
                        <p>5-10 years old (€50 each)</p>
                        <p>10-17 years old (€80 each)</p>
                      </div>
                      <div className="w-24 space-y-2">
                        <Input
                          id="children-under-5"
                          name="children.under-5"
                          type="number"
                          min="0"
                          value={formData.children["under-5"] || 0}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              children: {
                                ...prev.children,
                                "under-5": parseInt(e.target.value),
                              },
                            }))
                          }
                        />
                        <Input
                          id="children-5-10"
                          name="children.5-10"
                          type="number"
                          min="0"
                          value={formData.children["5-10"]}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              children: {
                                ...prev.children,
                                "5-10": parseInt(e.target.value),
                              },
                            }))
                          }
                        />
                        <Input
                          id="children-10-17"
                          name="children.10-17"
                          type="number"
                          min="0"
                          value={formData.children["10-17"]}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              children: {
                                ...prev.children,
                                "10-17": parseInt(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="hidden md:block space-y-6">
              <div>
                <Label htmlFor="fullName" className="text-lg font-bold">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-lg font-bold">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label className="text-lg font-bold">Workshops</Label>
                <div className="space-y-2">
                  {workshops.map((workshop) => (
                    <div
                      key={workshop.id}
                      className="flex items-center space-x-2 p-2"
                    >
                      <Checkbox
                        id={`workshop-${workshop.id}`}
                        checked={formData.workshops.includes(workshop.id)}
                        onCheckedChange={(checked) =>
                          handleWorkshopChange(workshop.id, checked)
                        }
                      />
                      <Label htmlFor={`workshop-${workshop.id}`}>
                        {workshop.name} - €{workshop.price}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-lg font-bold">Accommodation</Label>
                <RadioGroup
                  value={formData.accommodation.type}
                  onValueChange={handleAccommodationChange}
                  className="space-y-2"
                >
                  {accommodationOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 p-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`accommodation-${option.value}`}
                      />
                      <Label htmlFor={`accommodation-${option.value}`}>
                        {option.label} - €{option.price} per night
                        {option.value !== "tent" && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {roomAvailability[option.value]} available
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="mt-2">
                  <Label htmlFor="nights">Number of nights</Label>
                  <Input
                    id="nights"
                    name="nights"
                    type="number"
                    min="0"
                    value={formData.accommodation.nights}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        accommodation: {
                          ...prev.accommodation,
                          nights: parseInt(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="text-lg font-bold">Food</Label>
                <Select
                  name="food"
                  value={formData.food.type}
                  onValueChange={handleFoodChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select food option" />
                  </SelectTrigger>
                  <SelectContent>
                    {foodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} (€{option.price} per day)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  <Label htmlFor="days">Number of days</Label>
                  <Input
                    id="days"
                    name="days"
                    type="number"
                    min="0"
                    value={formData.food.days}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        food: { ...prev.food, days: parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="text-lg font-bold">Children Tickets</Label>
                <div className="flex items-center space-y-2">
                  <div className="flex-1 space-y-2 items-center">
                    <p>Under 5 (free)</p>
                    <p>5-10 years old (€50 each)</p>
                    <p>10-17 years old (€80 each)</p>
                  </div>
                  <div className="w-24 space-y-2">
                    <Input
                      id="children-under-5"
                      name="children.under-5"
                      type="number"
                      min="0"
                      value={formData.children["under-5"] || 0}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          children: {
                            ...prev.children,
                            "under-5": parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                    <Input
                      id="children-5-10"
                      name="children.5-10"
                      type="number"
                      min="0"
                      value={formData.children["5-10"]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          children: {
                            ...prev.children,
                            "5-10": parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                    <Input
                      id="children-10-17"
                      name="children.10-17"
                      type="number"
                      min="0"
                      value={formData.children["10-17"]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          children: {
                            ...prev.children,
                            "10-17": parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="flex-1 hidden md:block">
        <CardHeader>
          <CardTitle>Registration Receipt</CardTitle>
        </CardHeader>
        <CardContent>
          <div id="registration-receipt" className="space-y-4">
            <p>
              <strong>Name:</strong> {formData.fullName}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <div>
              <strong>Workshops:</strong>
              <ul>
                {formData.workshops.map((workshopId) => {
                  const workshop = workshops.find((w) => w.id === workshopId);
                  return workshop ? (
                    <li key={workshop.id}>
                      {workshop.name} - €{workshop.price}
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
            <p>
              <strong>Accommodation:</strong>{" "}
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
              <strong>Food:</strong>{" "}
              {foodOptions.find((f) => f.value === formData.food.type)?.label} -
              €
              {(foodOptions.find((f) => f.value === formData.food.type)
                ?.price || 0) * formData.food.days}{" "}
              ({formData.food.days} days)
            </p>
            <p>
              <strong>Children Tickets:</strong>
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
              <p className="font-semibold">Payment Instructions:</p>
              <p>
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
                (€100 registration fee{" "}
                {formData.accommodation.type.includes("room") &&
                  `+ €${accommodationTotal()} for accommodation`}
                )
              </p>
              <div className="mt-2 flex items-center">
                <p className="mr-2">IBAN: DE89 3704 0044 0532 0130 00</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          copyToClipboard("DE89370400440532013000")
                        }
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
                Bank: Example Bank
                <br />
                BIC: EXAMPLEXXX
                <br />
                Reference: Your Name - Drum and Dance Workshop
              </p>
              <p className="mt-4">
                The remaining amount of €
                {total -
                  100 -
                  (formData.accommodation.type.includes("room")
                    ? accommodationTotal()
                    : 0)}{" "}
                is to be paid in cash at the venue.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 my-4">
            <Checkbox
              id="paymentMade"
              checked={formData.paymentMade}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, paymentMade: checked }))
              }
            />
            <Label htmlFor="paymentMade">
              Read the instructions and made the payment
            </Label>
          </div>
          <div className="mt-4 flex gap-4">
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.paymentMade || submitStatus !== "idle"}
              className="flex-1"
            >
              {submitStatus === "loading" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitStatus === "done" && <Check className="mr-2 h-4 w-4" />}
              {submitStatus === "idle"
                ? "Submit"
                : submitStatus === "loading"
                ? "Submitting..."
                : "Done"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <FloatingTotal
        total={total}
        onContinue={() => {
          setIsReceiptModalOpen(true);
        }}
      />
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        formData={formData}
        total={total}
        workshops={workshops}
        accommodationOptions={accommodationOptions}
        foodOptions={foodOptions}
        accommodationTotal={accommodationTotal}
        onDownloadReceipt={handleDownloadReceipt}
      />
    </div>
  );
}
