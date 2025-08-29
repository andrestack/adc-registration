"use client";

import {
  Home,
  Users,
  Hotel,
  UserCheck,
  Settings,
  DollarSign,
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
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "All Registrations",
    url: "/admin",
    icon: Users,
  },
  {
    title: "Accommodation",
    url: "/admin/accommodation",
    icon: Hotel,
  },
  {
    title: "Income & Expenses",
    url: "/admin/income-expenses",
    icon: DollarSign,
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
    title: "Dance",
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
          <SidebarGroupLabel>Main</SidebarGroupLabel>
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
