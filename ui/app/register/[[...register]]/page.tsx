import RegisterForm from '@/components/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'register - maek.ai',
  description: 'register for maek.ai, the minimalist note taking app',
}

export default function RegisterPage() {
  return <RegisterForm />
}
