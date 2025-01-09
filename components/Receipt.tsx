'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, Download, Loader2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'


export default function Receipt() {
  const [ibanCopied, setIbanCopied] = useState(false)
  const [paymentMade, setPaymentMade] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIbanCopied(true)
      setTimeout(() => setIbanCopied(false), 2000) // Reset after 2 seconds
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  const handleSubmit = async () => {
    setSubmitStatus('loading')
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSubmitStatus('done')
    console.log('Form submitted:', formData)
    setTimeout(() => setSubmitStatus('idle'), 2000)
  }

  const onDownloadReceipt = () => {
    // Implement download logic here
    console.log("Download Receipt Clicked");
  }


  // This would be updated in real-time based on the form data
  const formData = {
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Main St, City, Country',
    workshops: ['Djembe', 'Dance'],
    accommodation: { type: 'tent', nights: 3 },
    food: { type: 'full', days: 4 },
    children: { '5-10': 1, '10-17': 0 }
  }

  const calculateTotal = () => {
    let total = 0
    formData.workshops.forEach((workshop) => {
      if (workshop === 'Djembe') total += 150
      else if (workshop === 'Dance') total += 130
      else if (workshop === 'Balafon') total += 60
    })
    if (formData.accommodation.type === 'tent') {
      total += 15 * formData.accommodation.nights
    } else if (formData.accommodation.type === 'bungalow') {
      total += 40 * formData.accommodation.nights
    }
    if (formData.food.type === 'full') {
      total += 30 * formData.food.days
    } else if (formData.food.type === 'single') {
      total += 15 * formData.food.days
    }
    total += formData.children['5-10'] * 50
    total += formData.children['10-17'] * 80
    return total
  }

  const total = calculateTotal()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration Receipt</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Participant Information</h2>
        <p>Name: {formData.name}</p>
        <p>Email: {formData.email}</p>
        <p>Address: {formData.address}</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Selected Items</h2>
        <ul>
          {formData.workshops.map((workshop) => (
            <li key={workshop}>{workshop} Workshop</li>
          ))}
          {formData.accommodation.type && (
            <li>
              {formData.accommodation.type} accommodation for {formData.accommodation.nights} nights
            </li>
          )}
          {formData.food.type && (
            <li>
              {formData.food.type === 'full' ? 'Full catering' : 'Single meal'} for {formData.food.days} days
            </li>
          )}
          {formData.children['5-10'] > 0 && (
            <li>{formData.children['5-10']} children's tickets (5-10 years old)</li>
          )}
          {formData.children['10-17'] > 0 && (
            <li>{formData.children['10-17']} children's tickets (10-17 years old)</li>
          )}
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-4">Total: €{total}</h2>

        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="font-semibold">Payment Instructions:</p>
          <p>Please transfer €100 to the following bank account:</p>
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
            The remaining amount of €{total - 100} is to be paid in cash at the venue.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="paymentMade"
              checked={paymentMade}
              onCheckedChange={(checked: boolean) => setPaymentMade(checked)}
            />
            <Label htmlFor="paymentMade">Payment Made</Label>
          </div>
          <div className="flex gap-4">
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
      </CardContent>
    </Card>
  )
}

