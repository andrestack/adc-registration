import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ChildrenTickets({ updateFormData }: { updateFormData: (section: string, data: any) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    updateFormData('children', { [e.target.name]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="children-5-10">Children 5-10 years old (€50 each)</Label>
        <Input
          id="children-5-10"
          name="5-10"
          type="number"
          min="0"
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="children-10-17">Children 10-17 years old (€80 each)</Label>
        <Input
          id="children-10-17"
          name="10-17"
          type="number"
          min="0"
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

