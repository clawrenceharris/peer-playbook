"use client"
import React from "react";
import { AuthLayout, LoginForm } from "@/features/auth/components";

export default function Page() {
  
  return (
    <AuthLayout authType="login">
        <LoginForm/>
    </AuthLayout>
   );
}
