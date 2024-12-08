import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function FoodSelection({ updateFormData }: { updateFormData: (section: string, data: any) => void }) {
  const [foodType, setFoodType] = useState<string>('')
  const [days, setDays] = useState<number>(0)

  const handleFoodChange = (value: string) => {
    setFoodType(value)
    updateFormData('food', { type: value, days })
  }

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const daysValue = parseInt(e.target.value)
    setDays(daysValue)
    updateFormData('food', { type: foodType, days: daysValue })
  }

  return (
    <div className="space-y-4">
      <RadioGroup onValueChange={handleFoodChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="full" id="full" />
          <Label htmlFor="full">Full catering (€30 per day)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="single" id="single" />
          <Label htmlFor="single">Single meal (€15 per day)</Label>
        </div>
      </RadioGroup>
      <div>
        <Label htmlFor="days">Number of days</Label>
        <Input
          id="days"
          type="number"
          min="0"
          value={days}
          onChange={handleDaysChange}
        />
      </div>
    </div>
  )
}

