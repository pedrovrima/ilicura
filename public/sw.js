if (!self.define) {
  let e,
    s = {};
  const i = (i, a) => (
    (i = new URL(i + ".js", a).href),
    s[i] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = i), (e.onload = s), document.head.appendChild(e);
        } else (e = i), importScripts(i), s();
      }).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, n) => {
    const c =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[c]) return;
    let t = {};
    const r = (e) => i(e, c),
      o = { module: { uri: c }, exports: t, require: r };
    s[c] = Promise.all(a.map((e) => o[e] || r(e))).then((e) => (n(...e), t));
  };
}
define(["./workbox-c06b064f"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/GkUWfMbzOWl5eOGtD2YWM/_buildManifest.js",
          revision: "e0a21c7d7f93d89dce16df0231dc76f2",
        },
        {
          url: "/_next/static/GkUWfMbzOWl5eOGtD2YWM/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/250-59c047dc40637948.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/468-91a5dfd19981aafe.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/579-f5e8aa58382d3fcb.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/67-18c82455d66d4ff3.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/942-2fe645c256957b58.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/aaea2bcf-d781819a29cd2b2a.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/app/_not-found-c01c84f03057bd4c.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/app/admin/species/%5Bid%5D/page-7010d63f0b563402.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/app/layout-8dd2729c4ce3f4aa.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/app/page-07becad5cb2d7f81.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/app/species/%5Bid%5D/page-b9dc243659852391.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/d12af4b9-4991bee645295b7a.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/e37a0b60-76bbad0149c7f5fd.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/fd9d1056-76c48a3f0a23d645.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/framework-aec844d2ccbe7592.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/main-app-c1bf4840e5cebb8c.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/main-fd5fccdce511e379.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/pages/_app-75f6107b0260711c.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/pages/_error-9a890acb1e81c3fc.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
          revision: "837c0df77fd5009c9e46d446188ecfd0",
        },
        {
          url: "/_next/static/chunks/webpack-b724063156a8402b.js",
          revision: "GkUWfMbzOWl5eOGtD2YWM",
        },
        {
          url: "/_next/static/css/1de9ebbcc485a716.css",
          revision: "1de9ebbcc485a716",
        },
        {
          url: "/_next/static/media/05a31a2ca4975f99-s.woff2",
          revision: "f1b44860c66554b91f3b1c81556f73ca",
        },
        {
          url: "/_next/static/media/513657b02c5c193f-s.woff2",
          revision: "c4eb7f37bc4206c901ab08601f21f0f2",
        },
        {
          url: "/_next/static/media/51ed15f9841b9f9d-s.woff2",
          revision: "bb9d99fb9bbc695be80777ca2c1c2bee",
        },
        {
          url: "/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2",
          revision: "74c3556b9dad12fb76f84af53ba69410",
        },
        {
          url: "/_next/static/media/d6b16ce4a6175f26-s.woff2",
          revision: "dd930bafc6297347be3213f22cc53d3e",
        },
        {
          url: "/_next/static/media/ec159349637c90ad-s.woff2",
          revision: "0e89df9522084290e01e4127495fae99",
        },
        {
          url: "/_next/static/media/fd4db3eb5472fc27-s.woff2",
          revision: "71f3fcaf22131c3368d9ec28ef839831",
        },
        { url: "/favicon.ico", revision: null },
        { url: "/species/1", revision: "a0" },
        { url: "/species/10", revision: "a9" },
        { url: "/species/11", revision: "a10" },
        { url: "/species/12", revision: "a11" },
        { url: "/species/13", revision: "a12" },
        { url: "/species/14", revision: "a13" },
        { url: "/species/15", revision: "a14" },
        { url: "/species/16", revision: "a15" },
        { url: "/species/17", revision: "a16" },
        { url: "/species/18", revision: "a17" },
        { url: "/species/19", revision: "a18" },
        { url: "/species/2", revision: "a1" },
        { url: "/species/20", revision: "a19" },
        { url: "/species/3", revision: "a2" },
        { url: "/species/4", revision: "a3" },
        { url: "/species/5", revision: "a4" },
        { url: "/species/6", revision: "a5" },
        { url: "/species/7", revision: "a6" },
        { url: "/species/8", revision: "a7" },
        { url: "/species/9", revision: "a8" },
        {
          url: "/swe-worker-4da67dda9bc18c53.js",
          revision: "5a47d90db13bb1309b25bdf7b363570e",
        },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: i }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        i &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: i }) =>
        "1" === e.headers.get("RSC") && i && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0);
});
