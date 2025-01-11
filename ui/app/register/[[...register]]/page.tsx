import RegisterForm from '@/components/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'maek',
  description: 'register for maek, the minimalist note taking app',
}

export default function RegisterPage() {
  return <RegisterForm />
}
