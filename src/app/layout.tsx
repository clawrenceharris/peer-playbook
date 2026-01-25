"use client";

import "./globals.css";

import { ModalProvider, QueryProvider } from "@/app/providers";
import { ReactNode } from "react";
import {Outfit, Figtree} from "next/font/google"
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",

})
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: "500"

})
export default function RootLayout({ children }: { children: ReactNode }) {
  
  
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${outfit.variable} antialiased`}>
       
        <QueryProvider>
          <ModalProvider>


            {children}
            </ModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
