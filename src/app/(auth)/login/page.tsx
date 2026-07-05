"use client"

import { AuthLayout, LoginForm } from "@/features/auth/presentation/components";

export default function Page() {
  return (
    <AuthLayout authType="login">
      <LoginForm  />
    </AuthLayout>
   );
}
