import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { assets } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  authType: "login" | "sign-up";
}
export function AuthLayout({ children, authType }: AuthLayoutProps) {
  return (
    <div className="w-full m-auto max-w-3xl overflow-hidden items-center justify-center md:min-w-160 flex-col md:flex-row flex  p-3 h-full  max-h-160">
      <div className="row p-2 w-full  h-140 overflow-hidden max-h-23 md:justify-center gap-4 md:p-8 border-4 border-card rounded-2xl rounded-b-none md:rounded-l-2xl md:rounded-r-none bg-gray-800 text-white shadow-md shadow-black/20 md:flex-col md:items-center md:w-full md:max-w-70 md:h-full md:max-h-full">
        <div className="flex flex-row md:flex-col gap-2 items-center md:items-start">
          <Image
            onClick={() => {
              window.location.href = "/";
            }}
            src={assets.logo}
            priority
            alt="PeerPlaybook logo"
            width={100}
            height={100}
          />
          <h2 className="leading-12 text-md md:text-4xl">
            Plan, Facilitate, Learn, together.
          </h2>
        </div>
      </div>

      <Card className="w-full shadow-md overflow-y-auto h-full rounded-t-none md:rounded-t-2xl md:rounded-l-none">
        <CardHeader className="border-b p-6 bg-card">
          <CardTitle className="text-2xl flex items-center font-semibold">
            Welcome to
            <span className="inline-flex items-center">
              <Image
                className="inline-block ml-1 align-middle"
                src={assets.logoSecondary}
                width={170}
                priority
                height={170}
                alt="PeerPlaybook"
              />
              <span className="sr-only">PeerPlaybook</span>
            </span>
          </CardTitle>
          <CardDescription>{"Your SI planning tool."}</CardDescription>
        </CardHeader>
        <CardContent className="flex h-full   items-center">
          {children}
        </CardContent>
        <CardFooter className="text-sm justify-center">
          {authType === "sign-up"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <Link
            href={authType === "login" ? "/auth/sign-up" : "/auth/login"}
            className="font-medium underline btn-link text-secondary-400"
          >
            {authType === "login" ? "Sign up" : "Log in"}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
