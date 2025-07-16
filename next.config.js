/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
(async () => {
  await import("./src/env.js");
})();
import withPWAInit from "@ducanh2912/next-pwa";
import { ilicuraPageManifest, ilicuraPhotoManifest } from "./ilicura_data.js";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    maximumFileSizeToCacheInBytes: 20000000,
    disableDevLogs: true,
    additionalManifestEntries: [
      ...ilicuraPageManifest,
      ...ilicuraPhotoManifest,
    ],
  },
});

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
};

export default withPWA(config);
