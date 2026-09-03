"use client";

import {
  Home,
  Users,
  Hotel,
  UserCheck,
  Settings,
  DollarSign,
  UtensilsCrossed,
  Archive,
  Mail,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items for admin navigation
const items = [
  {
    title: "Painel",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Todas as Inscrições",
    url: "/admin",
    icon: Users,
  },
  {
    title: "Alojamento",
    url: "/admin/accommodation",
    icon: Hotel,
  },
  {
    title: "Comida",
    url: "/admin/food",
    icon: UtensilsCrossed,
  },
  {
    title: "Receitas e Despesas",
    url: "/admin/income-expenses",
    icon: DollarSign,
  },
];

// Archive menu items
const archiveItems = [
  {
    title: "ADC 2025",
    url: "/admin/archive/2025",
    icon: Archive,
  },
];

// Workshop menu items
const workshopItems = [
  {
    title: "Djembe",
    url: "/admin/workshops/djembe",
    icon: UserCheck,
  },
  {
    title: "Dança",
    url: "/admin/workshops/dance",
    icon: UserCheck,
  },
  {
    title: "Balafon",
    url: "/admin/workshops/balafon",
    icon: UserCheck,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Image
            src="/images/ADC_logo_no_bg.png"
            alt="ADC Logo"
            width={32}
            height={32}
          />
          <span className="text-lg font-semibold font-garda-empty">
            ADC Admin
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Workshops</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workshopItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Arquivo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {archiveItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/email">
                <Mail />
                <span>Email</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/settings">
                <Settings />
                <span>Definições</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
