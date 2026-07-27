import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { manrope, geistSans, geistMono, gardaEmpty } from "@/lib/fonts";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Painel de Administração - ADC 2026",
  description: "Gestão de inscrições para o Aldeia Djembe Camp 2026",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The admin is PT-only; i18n/request.ts falls back to the default locale (pt)
  const messages = await getMessages();

  return (
    <html lang="pt">
      <body
        className={`${manrope.className} ${geistSans.variable} ${geistMono.variable} ${gardaEmpty.variable} antialiased`}
      >
        <NextIntlClientProvider locale="pt" messages={messages}>
          <div className="min-h-screen bg-background">
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-1">
                <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="container flex h-14 items-center px-4">
                    <SidebarTrigger />
                    <h1 className="ml-4 text-lg font-medium font-garda-empty">
                      Painel de Administração
                    </h1>
                  </div>
                </div>
                <div className="container mx-auto px-4 py-6">{children}</div>
              </main>
            </SidebarProvider>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
