import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const gardaEmpty = localFont({
  src: "../fonts/Gardaempty.woff",
  variable: "--font-garda-empty",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Admin Dashboard - ADC 2025",
  description: "Manage registrations for Aldeia Djembe Camp 2025",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${geistSans.variable} ${gardaEmpty.variable} min-h-screen bg-white`}
    >
      <div className="border-b">
        <div className="container mx-auto flex h-fit items-center px-4">
          <Image
            src={"/images/ADC_logo_no_bg.png"}
            alt="ADC Logo"
            width={50}
            height={50}
          />
          <h1 className="text-2xl font-medium font-garda-empty"> Admin</h1>
        </div>
      </div>
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
}
