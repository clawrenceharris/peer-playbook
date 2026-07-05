
"use client";
export const dynamic = 'force-dynamic';


import { Button } from "@/components/ui";
import { ForgotPasswordForm } from "@/features/auth/presentation/components/forms";
import { AuthLayout } from "@/features/auth/presentation/components/layout";
import { assets } from "@/lib/constants";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex  h-screen">
    <header className="fixed py-3 px-4 top-0 left-0  z-50 w-full flex justify-between items-center">
        <Image src={assets.logo} alt="PeerPlaybook Logo" className="w-full max-w-40" width={833} height={167} />
      <Button variant="primary">
        Login
      </Button>
      </header>
    <main className="flex flex-col items-center justify-center">
    <AuthLayout authType="forgot-password">
     
      <ForgotPasswordForm />
    </AuthLayout>
    </main>
    </div>
  );
}
