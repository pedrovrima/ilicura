import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    IMAGEK_PUBLIC_KEY: z.string(),
    IMAGEK_PRIVATE_KEY: z.string(),
    IMAGEK_URL_ENDPOINT: z.string().url(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_IMAGEK_PUBLIC_KEY: z.string(),
    NEXT_PUBLIC_IMAGEK_PRIVATE_KEY: z.string(),
    NEXT_PUBLIC_IMAGEK_URL_ENDPOINT: z.string().url(),
    NEXT_PUBLIC_MAINTENANCE: z.string().default("false"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    IMAGEK_PUBLIC_KEY: process.env.IMAGEK_PUBLIC_KEY,
    IMAGEK_PRIVATE_KEY: process.env.IMAGEK_PRIVATE_KEY,
    IMAGEK_URL_ENDPOINT: process.env.IMAGEK_URL_ENDPOINT,
    NEXT_PUBLIC_IMAGEK_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEK_PUBLIC_KEY,

    NEXT_PUBLIC_IMAGEK_PRIVATE_KEY: process.env.NEXT_PUBLIC_IMAGEK_PRIVATE_KEY,
    NEXT_PUBLIC_IMAGEK_URL_ENDPOINT:
      process.env.NEXT_PUBLIC_IMAGEK_URL_ENDPOINT,
    NEXT_PUBLIC_MAINTENANCE: process.env.NEXT_PUBLIC_MAINTENANCE,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
