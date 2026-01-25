"use client"
import {AuthLayout, SignUpForm } from '@/features/auth/components'

export default function Page() {
  return (

    <AuthLayout authType='sign-up'>
      <SignUpForm />
    </AuthLayout>
  )
}
