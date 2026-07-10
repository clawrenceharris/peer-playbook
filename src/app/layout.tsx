import "./globals.css";

import {
  AuthProvider,
  ModalProvider,
  QueryProvider,
} from "@/components/providers";
import { ReactNode } from "react";
import { Outfit, Figtree } from "next/font/google";
import { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { prefetchAuthenticatedAppData } from "@/lib/queries/prefetchAuthenticatedAppData";
import { User } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "PeerPlaybook",
  description:
    "Your convenient planning tool for student-led study group sessions.",
};

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: "500",
});
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = new QueryClient();
  let initialUser: User | null | undefined;

  try {
    initialUser = await prefetchAuthenticatedAppData(queryClient);
  } catch (error) {
    console.error("[RootLayout] prefetchAuthenticatedAppData failed:", error);
  }

  const dehydratedState = dehydrate(queryClient);
  return (
    <html lang="en">
      <body
        className={`${figtree.variable} ${outfit.variable} font-body antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <ModalProvider>{children}</ModalProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
