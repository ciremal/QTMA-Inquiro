import { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Providers } from "../providers";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const bagnard = localFont({
  src: "../fonts/Bagnard.woff",
  variable: "--font-bagnard",
  weight: "100 900",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dmsans",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Inquiro",
  description: "QTMA 2024 - Inquiro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} 
        ${geistMono.variable} 
        ${bagnard.variable} 
        ${dmSans.variable} 
        ${inter.variable} 
        antialiased 
        bg-background
        dark:bg-foreground
        bg-radial-gradient
        flex flex-col min-h-screen
        `}
      >
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
