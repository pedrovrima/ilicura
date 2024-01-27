import { useState } from "react";
import { Button } from "./button";
import { Loader, X } from "lucide-react";
import { useEffect } from "react";

export default function DeleteButton({
  isLoading: isDeleting,
  onClick,
}: {
  isLoading: boolean;
  onClick: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!isDeleting) {
      setIsLoading(false);
      return;
    }
  }, [isDeleting]);

  return (
    <Button
      className="h-auto w-min rounded-full border-[1px]  border-transparent bg-red-600 px-1 py-1 text-white transition  hover:border-red-600 hover:bg-transparent hover:text-red-600"
      type="submit"
      disabled={isLoading}
      onClick={() => {
        onClick();
        setIsLoading(true);
      }}
    >
      {isLoading ? (
        <Loader size={16} className="animate-spin-slow" />
      ) : (
        <X size={14} className="my-0" />
      )}
    </Button>
  );
}
