"use client";
import { useSidebar } from "@/store";
import { useEffect } from "react";
import { useStore } from "zustand";

export default function CreatePlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebar, (x) => x);
  const { setSettings } = sidebar;
  useEffect(() => {
    setSettings({
      disabled: true,
    });

    return () => {
      setSettings({
        disabled: false,
      });
    };
  }, [setSettings]);
  return <>{children}</>;
}
