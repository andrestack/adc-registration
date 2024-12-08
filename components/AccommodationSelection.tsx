import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function AccommodationSelection({ updateFormData }: { updateFormData: (section: string, data: any) => void }) {
  const [accommodationType, setAccommodationType] = useState<string>('')
  const [nights, setNights] = useState<number>(0)

  const handleAccommodationChange = (value: string) => {
    setAccommodationType(value)
    updateFormData('accommodation', { type: value, nights })
  }

  const handleNightsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nightsValue = parseInt(e.target.value)
    setNights(nightsValue)
    updateFormData('accommodation', { type: accommodationType, nights: nightsValue })
  }

  return (
    <div className="space-y-4">
      <RadioGroup onValueChange={handleAccommodationChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="tent" id="tent" />
          <Label htmlFor="tent">Tent (€15 per person, per night)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bungalow" id="bungalow" />
          <Label htmlFor="bungalow">Bungalow (€40 per room, per night) - 14 rooms available</Label>
        </div>
      </RadioGroup>
      <div>
        <Label htmlFor="nights">Number of nights</Label>
        <Input
          id="nights"
          type="number"
          min="0"
          value={nights}
          onChange={handleNightsChange}
        />
      </div>
    </div>
  )
}

