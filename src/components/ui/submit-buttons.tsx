import { Button } from "./button";
import { Loader } from "lucide-react";

export default function SubmitButton({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Button
      className="w-full bg-primary-foreground text-primary "
      type="submit"
      disabled={isLoading}
      variant={"outline"}
    >
      {isLoading ? (
        <div className="flex gap-4 ">
          <Loader className="animate-spin-slow" />
        </div>
      ) : (
        children ?? "Adicionar"
      )}
    </Button>
  );
}
