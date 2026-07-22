"use client";

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Landing() {
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between p-4">
        <Image
          src="/images/logo.png"
          alt="PeerPlaybook"
          width={100}
          height={100}
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/sign-up")}>
            Sign Up
          </Button>
          <Button variant="primary" onClick={() => router.push("/login")}>
            Log In
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-xl items-center justify-center gap-4 p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>
              <h1>PeerPlaybook</h1>
            </CardTitle>
            <CardDescription>Where peers teach peers</CardDescription>
          </CardHeader>

          <CardFooter>
            <CardAction>
              <Button variant="primary" onClick={() => router.push("/sign-in")}>
                Get Started
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
