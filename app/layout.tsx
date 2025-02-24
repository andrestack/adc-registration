import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const gardaEmpty = localFont({
  src: "./fonts/Gardaempty.woff",
  variable: "--font-garda-empty",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Inscrição ADC 2025",
  description: "Formulário de inscrição para o Aldeia Djembe Camp 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gardaEmpty.variable} antialiased`}
        style={{background: 'linear-gradient(to top, #c5d556, #ffffff)'}}
      >
        {children}
      </body>
    </html>
  );
}
  