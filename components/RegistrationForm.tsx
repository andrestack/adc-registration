'use client'

import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, Check, Download, Loader2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { downloadReceipt } from '@/utils/downloadReceipt'
import { Accordion } from '@/components/ui/accordion'
import FloatingTotal from './FloatingTotal'
import ReceiptModal from './ReceiptModal'
import { PersonalInfo } from './PersonalInfo'
import { WorkshopSelection } from './WorkshopSelection'
import { AccommodationSelection } from './AccommodationSelection'
import { FoodSelection } from './FoodSelection'
import { ChildrenTickets } from './ChildrenTickets'
import { RegistrationFormData, workshops, accommodationOptions, foodOptions } from '@/schemas/registrationSchema'

export default function RegistrationForm() {
  const [total, setTotal] = useState(0)
  const [ibanCopied, setIbanCopied] = useState(false)
  const [roomAvailability, setRoomAvailability] = useState({
    'family-room': 6,
    'single-room': 6,
  })
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')

  const { watch, handleSubmit, formState: { errors }, setValue } = useFormContext<RegistrationFormData>()
  const formData = watch()

  useEffect(() => {
    calculateTotal()
  }, [formData])

  useEffect(() => {
    const timer = setTimeout(() => {
      setRoomAvailability({
        'family-room': Math.max(0, Math.floor(Math.random() * 7)),
        'single-room': Math.max(0, Math.floor(Math.random() * 7)),
      })
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const calculateTotal = () => {
    let total = 0
    formData.workshops.forEach(workshopSelection => {
      const workshop = workshops.find(w => w.id === workshopSelection.id)
      if (workshop) {
        if (workshop.levels) {
          const level = workshop.levels.find(l => l.id === workshopSelection.level)
          if (level) total += level.price
        } else {
          total += workshop.price
        }
      }
    })
    const selectedAccommodation = accommodationOptions.find(a => a.value === formData.accommodation.type)
    if (selectedAccommodation) total += selectedAccommodation.price * formData.accommodation.nights
    const selectedFood = foodOptions.find(f => f.value === formData.food.type)
    if (selectedFood) total += selectedFood.price * formData.food.days
    total += formData.children['5-10'] * 50
    total += formData.children['10-17'] * 80
    total += formData.children['under-5'] * 0
    setTotal(total)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIbanCopied(true)
      setTimeout(() => setIbanCopied(false), 2000)
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  const onSubmit = async (data: RegistrationFormData) => {
    setSubmitStatus("loading")
    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Form submitted:", data, "Total:", total)
    setSubmitStatus("done")
    setTimeout(() => setSubmitStatus("idle"), 2000)
  }

  const accommodationTotal = () => {
    const selectedAccommodation = accommodationOptions.find(a => a.value === formData.accommodation.type)
    return selectedAccommodation ? selectedAccommodation.price * formData.accommodation.nights : 0
  }

  const handleDownloadReceipt = () => {
    downloadReceipt('registration-receipt', `${formData.fullName.replace(/\s+/g, '-')}-receipt.png`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Drum and Dance Workshop Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="md:hidden">
              <Accordion type="single" collapsible className="w-full">
                <PersonalInfo />
                <WorkshopSelection />
                <AccommodationSelection />
                <FoodSelection />
                <ChildrenTickets />
              </Accordion>
            </div>
            <div className="hidden md:block space-y-6">
              <PersonalInfo />
              <WorkshopSelection />
              <AccommodationSelection />
              <FoodSelection />
              <ChildrenTickets />
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
            <p><strong>Name:</strong> {formData.fullName}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <div>
              <strong>Workshops:</strong>
              <ul>
                {formData.workshops.map(workshopSelection => {
                  const workshop = workshops.find(w => w.id === workshopSelection.id)
                  if (workshop) {
                    if (workshop.levels) {
                      const level = workshop.levels.find(l => l.id === workshopSelection.level)
                      return level ? (
                        <li key={`${workshop.id}-${level.id}`}>
                          {workshop.name} ({level.name}) - €{level.price}
                        </li>
                      ) : null
                    } else {
                      return (
                        <li key={workshop.id}>
                          {workshop.name} - €{workshop.price}
                        </li>
                      )
                    }
                  }
                  return null
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
              <div className="mt-2 flex items-center">
                <p className="mr-2">
                  IBAN: DE89 3704 0044 0532 0130 00
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard('DE89370400440532013000')}>
                        {ibanCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{ibanCopied ? 'Copied!' : 'Copy IBAN'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p>
                Bank: Example Bank<br />
                BIC: EXAMPLEXXX<br />
                Reference: Your Name - Drum and Dance Workshop
              </p>
              <p className="mt-4">
                The remaining amount of €{total - 100 - (formData.accommodation.type.includes('room') ? accommodationTotal() : 0)} is to be paid in cash at the venue.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 my-4">
            <Checkbox
              id="paymentMade"
              checked={formData.paymentMade}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  setValue('paymentMade', checked)
                }
              }}
            />
            <Label htmlFor="paymentMade">I have read the instructions and made the payment</Label>
          </div>
          <div className="mt-4 flex gap-4">
            <Button variant="outline" onClick={handleDownloadReceipt} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={!formData.paymentMade || submitStatus !== 'idle'}
              className="flex-1"
            >
              {submitStatus === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitStatus === 'done' && <Check className="mr-2 h-4 w-4" />}
              {submitStatus === 'idle' ? 'Submit' : submitStatus === 'loading' ? 'Submitting...' : 'Done'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <FloatingTotal total={total} onContinue={() => setIsReceiptModalOpen(true)} />
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
        onSubmit={handleSubmit(onSubmit)}
      />
    </div>
  )
}

