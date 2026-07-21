import "./globals.css";

import {
  AuthProvider,
  ModalProvider,
  QueryProvider,
} from "@/components/providers";
import { ReactNode } from "react";
import { Outfit, Figtree } from "next/font/google";
import { Metadata } from "next";
import { connection } from "next/server";
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
  // Auth prefetch reads cookies — wait for a request so build-time static
  // generation doesn't throw DYNAMIC_SERVER_USAGE.
  await connection();

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
        className={`${figtree.variable} ${outfit.variable} font-body relative antialiased`}
      >
        <QueryProvider dehydratedState={dehydratedState}>
          <AuthProvider initialUser={initialUser}>
            <ModalProvider>{children}</ModalProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
