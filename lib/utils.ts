import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
//checkbox logic
/*
  {useResponsive().isSmallDevice && (
              <div className="space-x-2">
                <Checkbox
                  id="readInstructions"
                  name="readInstructions"
                  checked={formData.readInstructions}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      readInstructions: checked,
                    }))
                  }
                />
                <Label htmlFor="readInstructions">Read Instructions*</Label>
              </div>
            )}
            <div className="space-x-2">
              <Checkbox
                id="paymentMade"
                name="paymentMade"
                checked={formData.paymentMade}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, paymentMade: checked }))
                }
              />
              <Label htmlFor="paymentMade">Payment Made</Label>
            </div>

            <Button
              type="submit"
              disabled={!formData.paymentMade || !formData.readInstructions}
            >
              Submit Registration
            </Button>
            {window.innerWidth < 768 ? (
              <p className="text-sm text-muted-foreground">
                {" "}
                *PT: Total final e instruções de pagamento em baixo. <br />
                *EN: The total amount and payment instructions are below.
              </p>
            ) : null}
*/
