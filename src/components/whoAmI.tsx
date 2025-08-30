"use client";
import { api } from "@/trpc/react";

export const WhoIAmButton = () => {
  const whoAmI = api.whoAmI.useMutation();
  const test = api.test.useMutation();
  return (
    <button
      onClick={async () => {
        const whoAmIResult = await whoAmI.mutate();
        console.log("whoAmI", whoAmIResult);
        const testResult = await test.mutate();
        console.log("testResult", testResult);
      }}
    >
      Who am I?
    </button>
  );
};
