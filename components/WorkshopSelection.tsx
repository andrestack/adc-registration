import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const workshops = [
  { name: 'Djembe', duration: '10h', price: 150, levels: ['Advanced', 'Intermediate'] },
  { name: 'Dance', duration: '12h', price: 130 },
  { name: 'Balafon', duration: '5h', price: 60 },
]

export default function WorkshopSelection({ updateFormData }: { updateFormData: (section: string, data: any) => void }) {
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([])
  const [djembeLevel, setDjembeLevel] = useState<string>('')

  const handleWorkshopChange = (workshopName: string, checked: boolean) => {
    const updatedWorkshops = checked
      ? [...selectedWorkshops, workshopName]
      : selectedWorkshops.filter(w => w !== workshopName)
    setSelectedWorkshops(updatedWorkshops)
    updateFormData('workshops', updatedWorkshops)
  }

  const handleDjembeLevelChange = (level: string) => {
    setDjembeLevel(level)
    updateFormData('djembeLevel', level)
  }

  return (
    <div className="space-y-4">
      {workshops.map((workshop) => (
        <div key={workshop.name} className="flex items-center space-x-2">
          <Checkbox
            id={workshop.name}
            checked={selectedWorkshops.includes(workshop.name)}
            onCheckedChange={(checked) => handleWorkshopChange(workshop.name, checked as boolean)}
          />
          <Label htmlFor={workshop.name}>
            {workshop.name} ({workshop.duration} - €{workshop.price})
          </Label>
          {workshop.name === 'Djembe' && selectedWorkshops.includes('Djembe') && (
            <Select onValueChange={handleDjembeLevelChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {workshop.levels?.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
    </div>
  )
}

