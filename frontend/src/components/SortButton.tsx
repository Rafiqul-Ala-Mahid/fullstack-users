import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SortDirection = "none" | "asc" | "desc";

interface SortButtonProps {
  direction: SortDirection;
  onChange: (direction: SortDirection) => void;
  disabled?: boolean;
}

export function SortButton({ direction, onChange, disabled }: SortButtonProps) {
  const handleClick = () => {
    const nextDirection: SortDirection =
      direction === "none" ? "asc" : direction === "asc" ? "desc" : "none";
    onChange(nextDirection);
  };

  const Icon =
    direction === "asc"
      ? ArrowUp
      : direction === "desc"
      ? ArrowDown
      : ArrowUpDown;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      className="gap-2"
    >
      <Icon className="h-4 w-4" />
      Sort by Name
    </Button>
  );
}
