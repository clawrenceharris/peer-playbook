"use client";
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui";
import { ForgotPasswordForm } from "@/features/auth/presentation/components/forms";
import { AuthLayout } from "@/features/auth/presentation/components/layout";
import { assets } from "@/lib/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  return (
    <div className="flex h-screen">
      <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-4 py-3">
        <Image
          src={assets.logo}
          alt="PeerPlaybook Logo"
          className="h-auto w-full max-w-17"
          width={833}
          height={167}
        />
        <Button onClick={() => router.push("/login")} variant="primary">
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
