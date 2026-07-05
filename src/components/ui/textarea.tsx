import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "input field-sizing-content min-h-18 rounded-xl border bg-input px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
