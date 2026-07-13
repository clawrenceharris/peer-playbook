"use client"

import { UpdatePasswordForm } from "@/features/auth/presentation/components/forms"
import { AuthLayout } from "@/features/auth/presentation/components/layout"

export default function Page() {
  return (
    <AuthLayout authType="update-password">
      <UpdatePasswordForm />
    </AuthLayout>
  )
}
