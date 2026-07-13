"use client";
import React from "react";

import { Card, CardContent, CardFooter } from "@/components/ui";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  authType: "login" | "sign-up" | "forgot-password" | "update-password";
}
export function AuthLayout({ children, authType }: AuthLayoutProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-120 flex-col overflow-hidden overflow-y-auto px-8 py-5">
      <div className="flex flex-1 items-center">{children}</div>
      <div className="flex items-center justify-center text-sm">
        {authType === "sign-up"
          ? "Already have an account?"
          : authType === "forgot-password" || authType === "login"
            ? "Don't have an account?"
            : ""}
        <Link
          href={authType === "login" ? "/sign-up" : "/login"}
          className="btn-link text-primary ml-1 font-medium underline"
        >
          {authType === "login" || authType === "forgot-password"
            ? "Sign up"
            : authType === "sign-up"
              ? "Log in"
              : ""}
        </Link>
      </div>
    </div>
  );
}
