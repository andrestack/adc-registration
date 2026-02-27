import type { Metadata } from "next";
import localFont from "next/font/local";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

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
  title: "Admin Dashboard - ADC 2026",
  description: "Manage registrations for Aldeia Djembe Camp 2026",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${geistSans.variable} ${gardaEmpty.variable} min-h-screen bg-background`}
    >
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4">
              <SidebarTrigger />
              <h1 className="ml-4 text-lg font-medium font-garda-empty">
                Admin Dashboard
              </h1>
            </div>
          </div>
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
