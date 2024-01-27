import { Button } from "./button";
import { Loader } from "lucide-react";

export default function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button
      className="bg-transparent"
      type="submit"
      disabled={isLoading}
      variant={"outline"}
    >
      {isLoading ? (
        <div className="flex gap-4">
          <Loader className="animate-spin-slow" />
        </div>
      ) : (
        "Adicionar"
      )}
    </Button>
  );
}
