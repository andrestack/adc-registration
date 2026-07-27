import localFont from "next/font/local";
import { Manrope } from "next/font/google";

// Shared font config used by both root layouts:
// app/(public)/[locale]/layout.tsx and app/(admin)/admin/layout.tsx

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const geistSans = localFont({
  src: "../app/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const geistMono = localFont({
  src: "../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const gardaEmpty = localFont({
  src: "../app/fonts/Gardaempty.woff",
  variable: "--font-garda-empty",
  weight: "100 900",
});
