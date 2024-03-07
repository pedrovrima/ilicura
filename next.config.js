/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import withPWAInit from "@ducanh2912/next-pwa";

const test = Array.from({ length: 1897 }, (_, i) => ({
  url: "/species/" + (i + 1),
  revision: "d" + i,
}));

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    additionalManifestEntries: [
      {
        url: "https://ik.imagekit.io/ilicura/MIORUF_D128381_20211023__2___1__aoBaWnXxN.jpg?tr=w-200,h-200,fo-auto",
        revision: null,
      },
      {
        url: "/favicon.ico",
        revision: null,
      },
      ...test,
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
