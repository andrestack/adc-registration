import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Loader2, Download, Check } from 'lucide-react'

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  formData: {
    fullName: string
    email: string
    workshops: string[]
    accommodation: {
      type: string
      nights: number
    }
  }
  total: number
  workshops: {
    id: string
    name: string
    price: number
  }[]
  accommodationOptions: {
    value: string
    label: string
    price: number
  }[]
  foodOptions: {
    value: string
    label: string
    price: number
  }[]
  accommodationTotal: () => number
  onDownloadReceipt: () => void
  onSubmit: () => Promise<void>
}

export default function ReceiptModal({
  isOpen,
  onClose,
  formData,
  total,
  workshops,
  accommodationOptions,
  foodOptions,
  accommodationTotal,
  onDownloadReceipt,
  onSubmit,
}: ReceiptModalProps) {
  const [paymentMade, setPaymentMade] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleSubmit = async () => {
    setSubmitStatus('loading')
    await onSubmit()
    setSubmitStatus('done')
    setTimeout(() => setSubmitStatus('idle'), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[calc(100vh-2rem)] sm:h-auto my-4 mx-4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registration Receipt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p><strong>Name:</strong> {formData.fullName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <div>
            <strong>Workshops:</strong>
            <ul>
              {formData.workshops.map(workshopId => {
                const workshop = workshops.find(w => w.id === workshopId)
                return workshop ? <li key={workshop.id}>{workshop.name} - €{workshop.price}</li> : null
              })}
            </ul>
          </div>
          <p><strong>Accommodation:</strong> {
            accommodationOptions.find(a => a.value === formData.accommodation.type)?.label
          } - €{
            (accommodationOptions.find(a => a.value === formData.accommodation.type)?.price || 0) * formData.accommodation.nights
          } ({formData.accommodation.nights} nights)</p>
          <p><strong>Food:</strong> {
            foodOptions.find(f => f.value === formData.food.type)?.label
          } - €{
            (foodOptions.find(f => f.value === formData.food.type)?.price || 0) * formData.food.days
          } ({formData.food.days} days)</p>
          <p><strong>Children Tickets:</strong></p>
          <ul>
            <li>under 5: {formData.children['under-5']} x €0 = €{formData.children['under-5'] * 0}</li>
            <li>5-10 years: {formData.children['5-10']} x €50 = €{formData.children['5-10'] * 50}</li>
            <li>10-17 years: {formData.children['10-17']} x €80 = €{formData.children['10-17'] * 80}</li>
          </ul>
          <p className="text-xl font-bold">Total: €{total}</p>

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <p className="font-semibold">Payment Instructions:</p>
            <p>Please transfer the following amount to confirm your booking:</p>
            <p className="font-bold">€{100 + (formData.accommodation.type.includes('room') ? accommodationTotal() : 0)}</p>
            <p className="text-sm">
              (€100 registration fee {formData.accommodation.type.includes('room') && `+ €${accommodationTotal()} for accommodation`})
            </p>
            <p>
              IBAN: DE89 3704 0044 0532 0130 00<br />
              Bank: Example Bank<br />
              BIC: EXAMPLEXXX<br />
              Reference: Your Name - Drum and Dance Workshop
            </p>
            <p className="mt-4">
              The remaining amount of €{total - 100 - (formData.accommodation.type.includes('room') ? accommodationTotal() : 0)} is to be paid in cash at the venue.
            </p>
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
              <Label htmlFor="paymentMade">Li as instruções e efectuei pagamento</Label>
            </div>
            <div className="flex justify-between gap-4">
              <Button variant="outline" onClick={onDownloadReceipt} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!paymentMade || submitStatus !== 'idle'}
                className="flex-1"
              >
                {submitStatus === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitStatus === 'done' && <Check className="mr-2 h-4 w-4" />}
                {submitStatus === 'idle' ? 'Submit' : submitStatus === 'loading' ? 'Submitting...' : 'Done'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

