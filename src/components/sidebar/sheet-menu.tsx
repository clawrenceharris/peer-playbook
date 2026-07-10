import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/sidebar";
import { Menu as MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui";
import Image from "next/image";
import { assets } from "@/lib/constants";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="bg-surface rounded-md" variant="ghost" size="icon">
          <MenuIcon
            strokeWidth={2}
            className="text-muted-foreground size-6.5"
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        aria-describedby={undefined}
        className="flex h-full flex-col px-4 sm:w-59"
        side="left"
      >
        <SheetHeader className="items-start">
          <Link href="/home">
            <Image
              src={assets.logo}
              loading="eager"
              alt="PeerPlaybook Logo"
              width={50}
              height={50}
            />
            <SheetTitle className="sr-only">Brand logo</SheetTitle>
          </Link>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
