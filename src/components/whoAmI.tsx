"use client";
import { api } from "@/trpc/react";

export const WhoIAmButton = () => {
  const whoAmI = api.whoAmI.useMutation();
  return (
    <button
      onClick={async () => {
        const whoAmIResult = await whoAmI.mutate();
        console.log("whoAmI", whoAmIResult);
      }}
    >
      Who am I?
    </button>
  );
};
