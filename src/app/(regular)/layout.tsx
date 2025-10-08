import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import type { Metadata, Viewport } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const APP_NAME = "WikiMudas";
const APP_DEFAULT_TITLE = "WikiMudas";
const APP_TITLE_TEMPLATE = "WikiMudas";
const APP_DESCRIPTION = "Feito por OAMa";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#CCC",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link
        href="/splashscreens/iphone5_splash.png"
        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/splashscreens/iphone6_splash.png"
        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/splashscreens/iphoneplus_splash.png"
        media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/splashscreens/iphonex_splash.png"
        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/splashscreens/iphonexr_splash.png"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/splashscreens/iphonexsmax_splash.png"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/splashscreens/ipad_splash.png"
        media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/splashscreens/ipadpro1_splash.png"
        media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/splashscreens/ipadpro3_splash.png"
        media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <link
        href="/splashscreens/ipadpro2_splash.png"
        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        rel="apple-touch-startup-image"
      />
      <body className={`font-sans ${inter.variable}`}>
        <main className="flex min-h-screen flex-col bg-[#f1e4ca] text-secondary">
          <div className="absolute left-0 top-0 z-50 flex h-fit w-screen items-center justify-between bg-black px-4 py-4">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Image
                  alt="wikimudas logo"
                  width={10}
                  height={30}
                  src={"/logo_slim.png"}
                />
                <h1 className="text-md font-extrabold tracking-tight text-white">
                  Wiki<span className="text-primary">Mudas</span>
                </h1>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link className="hidden md:block" href="/species">
                Explorar
              </Link>
              <Link className="hidden md:block" href="/sobre">
                Sobre
              </Link>
              <a
                href="https://oama.eco.br/apoie"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="text-md rounded-full bg-yellow-400 px-4 py-1 font-bold text-yellow-900  hover:bg-yellow-500">
                  Apoie
                </button>
              </a>
            </div>
          </div>

          <div className=" h-full">{children}</div>
        </main>
      </body>
    </html>
  );
}
