import LoginForm from '@/components/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'maek',
  description: 'login to maek, the minimalist note taking app',
}

export default function LoginPage() {
  return <LoginForm />
}
