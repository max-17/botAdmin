import type React from "react";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
