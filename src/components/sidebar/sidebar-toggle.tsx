import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  onToggle?: () => void;
  disabled?: boolean;
}

export function SidebarToggle({ onToggle, disabled }: SidebarToggleProps) {
  return (
    <Button
      onClick={onToggle}
      className={"rounded-md active:translate-y-0!"}
      variant="ghost"
      size="icon"
      disabled={disabled}
    >
      <Menu strokeWidth={2} className="text-muted-foreground size-6.5" />
    </Button>
  );
}
