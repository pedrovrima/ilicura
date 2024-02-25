import { Loader, X } from "lucide-react";
import { Badge } from "./badge";
import { badgeVariants } from "./badge";
import { VariantProps } from "class-variance-authority";

export default function DeletePill({
  children,
  isLoading,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  isLoading: boolean;
  onClick: () => void;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>) {
  return (
    <Badge
      {...props}
      onClick={onClick}
      className="flex cursor-pointer text-lg capitalize"
    >
      {children}
      {!isLoading ? (
        <X className="ml-2" size={12} />
      ) : (
        <Loader className="ml-2 animate-spin-slow" size={12} />
      )}
    </Badge>
  );
}
