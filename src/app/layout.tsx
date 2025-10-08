import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";
export default function RootLayout({ children }) {
  return (
    <html>
      <TRPCReactProvider>
        <body>{children}</body>
      </TRPCReactProvider>
    </html>
  );
}
