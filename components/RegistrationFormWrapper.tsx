'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import RegistrationForm from './RegistrationForm'
import { registrationSchema, RegistrationFormData } from '@/schemas/registrationSchema'

export default function RegistrationFormWrapper() {
  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      workshops: [],
      accommodation: { type: 'tent', nights: 0 },
      food: { type: 'full', days: 0 },
      children: { 'under-5': 0, '5-10': 0, '10-17': 0 },
      paymentMade: false,
    },
  })

  return (
    <FormProvider {...methods}>
      <RegistrationForm />
    </FormProvider>
  )
}

