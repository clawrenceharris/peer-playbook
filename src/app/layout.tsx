"use client";

import "./globals.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { ModalProvider, ModalRegistration, QueryProvider } from "@/app/providers";
import { ReactNode } from "react";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
       
        <QueryProvider>
          <ModalProvider>

         
            {children}
            </ModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
