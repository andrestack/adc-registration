'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Mail, Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function Receipt() {
  const searchParams = useSearchParams()
  const formData = JSON.parse(decodeURIComponent(searchParams.get('data') || '{}'))
  const [email, setEmail] = useState(formData.email || '')
  const [ibanCopied, setIbanCopied] = useState(false)
  const { toast } = useToast()

  const calculateTotal = () => {
    let total = 0

    // Workshops
    formData.workshops.forEach((workshop: string) => {
      if (workshop === 'Djembe') total += 150
      else if (workshop === 'Dance') total += 130
      else if (workshop === 'Balafon') total += 60
    })

    // Accommodation
    if (formData.accommodation.type === 'tent') {
      total += 15 * formData.accommodation.nights
    } else if (formData.accommodation.type === 'bungalow') {
      total += 40 * formData.accommodation.nights
    }

    // Food
    if (formData.food.type === 'full') {
      total += 30 * formData.food.days
    } else if (formData.food.type === 'single') {
      total += 15 * formData.food.days
    }

    // Children's tickets
    total += formData.children['5-10'] * 50
    total += formData.children['10-17'] * 80

    return total
  }

  const total = calculateTotal()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIbanCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The IBAN has been copied to your clipboard.",
      })
      setTimeout(() => setIbanCopied(false), 3000) // Reset after 3 seconds
    }, (err) => {
      console.error('Could not copy text: ', err)
      toast({
        title: "Failed to copy",
        description: "There was an error copying the IBAN. Please try again.",
        variant: "destructive",
      })
    })
  }

  const sendReceiptByEmail = async () => {
    // In a real application, you would send this data to your backend
    // to handle the email sending process securely.
    console.log('Sending receipt to:', email)
    toast({
      title: "Receipt sent",
      description: `The receipt has been sent to ${email}`,
    })
  }

  return (
    <div className="container mx-auto p-4">
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
            {formData.workshops.map((workshop: string) => (
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
              <Button variant="outline" size="icon" onClick={() => copyToClipboard('DE89370400440532013000')}>
                {ibanCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
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

          <div className="mt-6">
            <Label htmlFor="email">Send receipt to email:</Label>
            <div className="flex mt-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mr-2"
              />
              <Button onClick={sendReceiptByEmail}>
                <Mail className="mr-2 h-4 w-4" /> Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

