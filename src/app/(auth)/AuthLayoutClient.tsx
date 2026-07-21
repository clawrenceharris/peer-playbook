"use client";
import { assets } from "@/lib/constants";
import Image from "next/image";

export default function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page to-primary from-secondary bg-white p-0">
      <header className="fixed top-0 left-0 z-50 flex items-center justify-center px-4 py-3">
        <Image
          src={assets.logo}
          alt="PeerPlaybook Logo"
          className="h-auto w-full max-w-23"
          width={833}
          loading="eager"
          height={167}
        />
      </header>
      <main className="flex flex-col md:flex-row">
        <div
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${assets.authHero.src})`,
          }}
          className="relative flex-1"
        />

        <div className="bg-surface flex h-full w-full flex-[0.7] items-center justify-center shadow-md shadow-black md:flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
