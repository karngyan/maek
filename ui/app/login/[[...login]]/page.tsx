import LoginForm from '@/components/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'login - maek.ai',
  description: 'login to maek.ai, the minimalist note taking app',
}

export default function LoginPage() {
  return <LoginForm />
}
