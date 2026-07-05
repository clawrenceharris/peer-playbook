"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import PlaybookPage from "../../[id]/PlaybookPage";

const CLOSE_MS = 320; // sheet.tsx closed duration is 300ms

export default function DrawerPlaybookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    if (open) {
      return;
    }
    const t = window.setTimeout(() => router.back(), CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [open, router]);
  return (
    <Sheet open={open}>
      <SheetContent
        showCloseButton={true}
        side="right"
        className="w-[calc(100vw-8rem)] sm:max-w-none p-0"
      >
        <SheetTitle className="sr-only">Playbook Drawer</SheetTitle>

        <PlaybookPage onBackClick={() => setOpen(false)} playbookId={id} />
      </SheetContent>
    </Sheet>
  );
}
