import type React from "react";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.role === "ADMIN") {
    return (
      <html lang="en">
        <body>
          <Providers>{children}</Providers>
          <Toaster />
        </body>
      </html>
    );
  } else {
    //redirect to /api/auth/signin
    return redirect("/api/auth/signin");
  }
}
