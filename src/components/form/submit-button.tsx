import React from "react";
import { Button, ButtonProps } from "@/components/ui";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends ButtonProps {
  label: string;
  loading?: boolean;
  className?: string;
}
export function SubmitButton({
  label,
  loading = false,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <Button type="submit" size="lg" className={className} {...props}>
      {loading ? <Loader2 className="animate-spin" /> : label}
    </Button>
  );
}
