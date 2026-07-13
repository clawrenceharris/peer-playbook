import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "input bg-input field-sizing-content min-h-18 rounded-xl border px-4 py-3 shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
