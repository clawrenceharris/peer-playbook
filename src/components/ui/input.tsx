import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "input flex w-full min-w-0 rounded-full px-4 py-3 text-base transition-[color,box-shadow,border,background] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm autofill:border-ring autofill:bg-primary-100/20  autofill:text-foreground file:text-foreground focus-visible:border-ring selection:text-primary-foreground lg:px-3",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
