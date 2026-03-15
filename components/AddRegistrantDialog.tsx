"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NumberInput } from "@/components/ui/number-input";
import {
  workshops,
  foodOptions,
  AdditionalRegistrant,
  Workshop,
} from "@/schemas/registrationSchema";
import { UserPlus, X } from "lucide-react";

interface AddRegistrantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (registrant: AdditionalRegistrant) => void;
}

export function AddRegistrantDialog({
  isOpen,
  onClose,
  onAdd,
}: AddRegistrantDialogProps) {
  const [formData, setFormData] = useState<AdditionalRegistrant>({
    fullName: "",
    email: "",
    workshops: [],
    food: { type: "none", days: 0 },
    children: { "under-5": 0, "5-10": 0, "10-17": 0 },
  });

  const handleWorkshopChange = (
    workshopId: string,
    checked: boolean,
    level?: string
  ) => {
    let updatedWorkshops = [...formData.workshops];
    if (checked) {
      if (level) {
        updatedWorkshops = updatedWorkshops.filter((w) => w.id !== workshopId);
        updatedWorkshops.push({ id: workshopId, level });
      } else if (!updatedWorkshops.some((w) => w.id === workshopId)) {
        updatedWorkshops.push({ id: workshopId });
      }
    } else {
      updatedWorkshops = updatedWorkshops.filter((w) => w.id !== workshopId);
    }
    setFormData((prev) => ({ ...prev, workshops: updatedWorkshops }));
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email) {
      return;
    }
    onAdd(formData);
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      workshops: [],
      food: { type: "none", days: 0 },
      children: { "under-5": 0, "5-10": 0, "10-17": 0 },
    });
    onClose();
  };

  const isValid = formData.fullName && formData.email;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Adicionar Pessoa / Add Person
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Personal Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="additional-name">Nome Completo / Full Name *</Label>
              <Input
                id="additional-name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label htmlFor="additional-email">Email *</Label>
              <Input
                id="additional-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Workshops */}
          <div className="space-y-3">
            <Label className="text-lg font-bold">Workshops</Label>
            <div className="space-y-3 ml-2">
              {workshops.map((workshop: Workshop) => (
                <div key={workshop.id} className="space-y-2">
                  {workshop.levels ? (
                    <div className="flex flex-col gap-2">
                      <Label className="font-medium">{workshop.name}</Label>
                      <RadioGroup
                        onValueChange={(value) =>
                          handleWorkshopChange(workshop.id, true, value)
                        }
                        value={
                          formData.workshops.find((w) => w.id === workshop.id)
                            ?.level || ""
                        }
                      >
                        {workshop.levels.map((level) => (
                          <div
                            key={level.id}
                            className="flex items-center space-x-2 ml-2"
                          >
                            <RadioGroupItem
                              value={level.id}
                              id={`additional-workshop-${workshop.id}-${level.id}`}
                            />
                            <Label
                              htmlFor={`additional-workshop-${workshop.id}-${level.id}`}
                            >
                              {level.name} - €{level.price}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`additional-workshop-${workshop.id}`}
                        checked={formData.workshops.some(
                          (w) => w.id === workshop.id
                        )}
                        onCheckedChange={(checked) =>
                          handleWorkshopChange(
                            workshop.id,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`additional-workshop-${workshop.id}`}>
                        {workshop.name} - €{workshop.price}
                      </Label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Food Selection */}
          <div className="space-y-3">
            <Label className="text-lg font-bold">Refeições / Food</Label>
            <RadioGroup
              value={formData.food.type}
              onValueChange={(value: "full" | "single" | "none") =>
                setFormData((prev) => ({
                  ...prev,
                  food: { ...prev.food, type: value },
                }))
              }
            >
              {foodOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`additional-food-${option.value}`}
                  />
                  <Label htmlFor={`additional-food-${option.value}`}>
                    {option.label} - €{option.price}
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="additional-food-none" />
                <Label htmlFor="additional-food-none">
                  Sem refeições / No meals
                </Label>
              </div>
            </RadioGroup>

            {formData.food.type !== "none" && (
              <div className="mt-3">
                <Label htmlFor="additional-food-days">
                  Número de dias / Number of days
                </Label>
                <NumberInput
                  id="additional-food-days"
                  min={1}
                  max={5}
                  value={formData.food.days}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      food: { ...prev.food, days: value },
                    }))
                  }
                />
              </div>
            )}
          </div>

          {/* Children */}
          <div className="space-y-3">
            <Label className="text-lg font-bold">
              Bilhetes de Crianças / Children Tickets
            </Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="additional-under-5">Menores de 5 / Under 5</Label>
                <NumberInput
                  id="additional-under-5"
                  min={0}
                  value={formData.children["under-5"]}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      children: { ...prev.children, "under-5": value },
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground mt-1">Gratuito / Free</p>
              </div>
              <div>
                <Label htmlFor="additional-5-10">5-10 anos / 5-10 years</Label>
                <NumberInput
                  id="additional-5-10"
                  min={0}
                  value={formData.children["5-10"]}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      children: { ...prev.children, "5-10": value },
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground mt-1">€50</p>
              </div>
              <div>
                <Label htmlFor="additional-10-17">10-17 anos / 10-17 years</Label>
                <NumberInput
                  id="additional-10-17"
                  min={0}
                  value={formData.children["10-17"]}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      children: { ...prev.children, "10-17": value },
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground mt-1">€80</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            <UserPlus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
