"use client"
import { LoadingState } from "@/components/states";
import { useAuth } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [router, user]);
  
  if (user) {
    return <LoadingState />
  }
  return (
    <main className="flex justify-center bg-linear-to-br to-primary-300 from-secondary-300">
      {children}
    </main>
  );
}

