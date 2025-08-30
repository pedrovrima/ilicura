import { speciesRouter } from "@/server/api/routers/species";
import { speciesInfoRouter } from "./routers/speciesInfo";
import { createTRPCRouter } from "@/server/api/trpc";
import { whoAmI, test } from "@/server/api/routers/tests";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  species: speciesRouter,
  speciesInfo: speciesInfoRouter,
  whoAmI,
  test,
});

// export type definition of API
export type AppRouter = typeof appRouter;
