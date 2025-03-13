import { Metadata } from "next";
import "../globals.css";
import { Providers } from "@/app/providers";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Inquiro",
  description: "QTMA 2024 - Inquiro - Sign in or sign up",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-foreground">
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
