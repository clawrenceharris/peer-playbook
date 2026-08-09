"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button font-semibold font-heading cursor-pointer rounded-md inline-flex shrink-0 items-center justify-center items-center  bg-clip-padding text-sm whitespace-nowrap transition-all outline-none select-none  disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        tertiary:
          "bg-tertiary active:translate-y-px active:not-aria-[haspopup]:translate-y-px text-tertiary-foreground hover:bg-tertiary/80 aria-expanded:bg-tertiary aria-expanded:text-tertiary-foreground",
        primary:
          "bg-primary active:translate-y-px active:not-aria-[haspopup]:translate-y-px text-primary-foreground shadow-[0_6px_0_hsl(var(--primary-hue)_95%_40%)] active:shadow-[0_1px_0_hsl(var(--primary-hue)_95%_40%)] hover:bg-primary-600  bg-primary",
        muted: "bg-muted text-muted-foreground hover:text-muted-foreground/80",
        default: "text-foreground hover:text-muted-foreground",
        outline:
          "border active:translate-y-px active:not-aria-[haspopup]:translate-y-px shadow-xs bg-background hover:bg-muted/60 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary active:translate-y-px active:not-aria-[haspopup]:translate-y-px text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground  bg-secondary hover:bg-secondary/70",
        ghost: "hover:bg-muted aria-expanded:bg-muted text-muted-foreground",
        destructive:
          "bg-destructive active:translate-y-px active:not-aria-[haspopup]:translate-y-px text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-7 gap-1 px-3 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4.5",
        sm: "h-8 text-md gap-1 px-5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-13 gap-1.5 px-6 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-11 [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
