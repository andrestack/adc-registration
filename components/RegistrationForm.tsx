'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const workshops = [
  { id: 'djembe', name: 'Djembe (10h - Advanced or Intermediate)', price: 150 },
  { id: 'dance', name: 'Dance (12h)', price: 130 },
  { id: 'balafon', name: 'Balafon (5h)', price: 60 },
]

const accommodationOptions = [
  { value: 'tent', label: 'Tent', price: 15 },
  { value: 'bungalow', label: 'Bungalow', price: 40 },
]

const foodOptions = [
  { value: 'full', label: 'Full catering', price: 30 },
  { value: 'single', label: 'Single meal', price: 15 },
]

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    workshops: [],
    accommodation: { type: '', nights: 0 },
    food: { type: '', days: 0 },
    children: { '5-10': 0, '10-17': 0 },
    paymentMade: false,
  })
  const [total, setTotal] = useState(0)
  const [ibanCopied, setIbanCopied] = useState(false)

  useEffect(() => {
    calculateTotal()
  }, [formData])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleWorkshopChange = (workshopId, checked) => {
    setFormData(prev => ({
      ...prev,
      workshops: checked
        ? [...prev.workshops, workshopId]
        : prev.workshops.filter(id => id !== workshopId)
    }))
  }

  const handleAccommodationChange = (type) => {
    setFormData(prev => ({
      ...prev,
      accommodation: { ...prev.accommodation, type }
    }))
  }

  const handleFoodChange = (type) => {
    setFormData(prev => ({
      ...prev,
      food: { ...prev.food, type }
    }))
  }

  const calculateTotal = () => {
    let total = 0
    // Workshops
    formData.workshops.forEach(workshopId => {
      const workshop = workshops.find(w => w.id === workshopId)
      if (workshop) total += workshop.price
    })
    // Accommodation
    const selectedAccommodation = accommodationOptions.find(a => a.value === formData.accommodation.type)
    if (selectedAccommodation) total += selectedAccommodation.price * formData.accommodation.nights
    // Food
    const selectedFood = foodOptions.find(f => f.value === formData.food.type)
    if (selectedFood) total += selectedFood.price * formData.food.days
    // Children Tickets
    total += formData.children['5-10'] * 50
    total += formData.children['10-17'] * 80
    setTotal(total)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIbanCopied(true)
      setTimeout(() => setIbanCopied(false), 2000)
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData)
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Drum and Dance Workshop Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
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
              <Label>Workshops</Label>
              {workshops.map((workshop) => (
                <div key={workshop.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={workshop.id}
                    checked={formData.workshops.includes(workshop.id)}
                    onCheckedChange={(checked) => handleWorkshopChange(workshop.id, checked)}
                  />
                  <Label htmlFor={workshop.id}>{workshop.name} (€{workshop.price})</Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="accommodation">Accommodation</Label>
              <Select
                name="accommodation"
                value={formData.accommodation.type}
                onValueChange={handleAccommodationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select accommodation" />
                </SelectTrigger>
                <SelectContent>
                  {accommodationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} (€{option.price} per night)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nights">Number of nights</Label>
              <Input
                id="nights"
                name="nights"
                type="number"
                min="0"
                value={formData.accommodation.nights}
                onChange={(e) => setFormData(prev => ({ ...prev, accommodation: { ...prev.accommodation, nights: parseInt(e.target.value) } }))}
              />
            </div>
            <div>
              <Label htmlFor="food">Food</Label>
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
            </div>
            <div>
              <Label htmlFor="days">Number of days</Label>
              <Input
                id="days"
                name="days"
                type="number"
                min="0"
                value={formData.food.days}
                onChange={(e) => setFormData(prev => ({ ...prev, food: { ...prev.food, days: parseInt(e.target.value) } }))}
              />
            </div>
            <div>
              <Label htmlFor="children-5-10">Children 5-10 years old (€50 each)</Label>
              <Input
                id="children-5-10"
                name="children.5-10"
                type="number"
                min="0"
                value={formData.children['5-10']}
                onChange={(e) => setFormData(prev => ({ ...prev, children: { ...prev.children, '5-10': parseInt(e.target.value) } }))}
              />
            </div>
            <div>
              <Label htmlFor="children-10-17">Children 10-17 years old (€80 each)</Label>
              <Input
                id="children-10-17"
                name="children.10-17"
                type="number"
                min="0"
                value={formData.children['10-17']}
                onChange={(e) => setFormData(prev => ({ ...prev, children: { ...prev.children, '10-17': parseInt(e.target.value) } }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="paymentMade"
                name="paymentMade"
                checked={formData.paymentMade}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, paymentMade: checked }))}
              />
              <Label htmlFor="paymentMade">Payment Made</Label>
            </div>
            <Button type="submit" disabled={!formData.paymentMade}>
              Submit Registration
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Registration Receipt</CardTitle>
        </CardHeader>
        <CardContent>
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
              <li>5-10 years: {formData.children['5-10']} x €50 = €{formData.children['5-10'] * 50}</li>
              <li>10-17 years: {formData.children['10-17']} x €80 = €{formData.children['10-17'] * 80}</li>
            </ul>
            <p className="text-xl font-bold">Total: €{total}</p>

            <div className="mt-6 p-4 bg-gray-100 rounded">
              <p className="font-semibold">Payment Instructions:</p>
              <p>Please transfer €100 to confirm your booking to the following bank account:</p>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

