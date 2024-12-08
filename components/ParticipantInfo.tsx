import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ParticipantInfo({ updateFormData }: { updateFormData: (section: string, data: any) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData('participantInfo', { [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" onChange={handleChange} required />
      </div>
    </div>
  )
}

