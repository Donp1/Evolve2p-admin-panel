"use client";

import * as React from "react";
import {
  ArrowLeftRight,
  ArrowLeftRightIcon,
  Banknote,
  BookOpen,
  Bot,
  Coins,
  Command,
  CreditCard,
  Frame,
  Handshake,
  Home,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  ShieldAlert,
  SquareTerminal,
  User2,
  User2Icon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useAuthStore } from "@/hooks/useAuth";

const data = {
  user: {
    // name: "Admin",
    // email: user?.email || "",
    // avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        // {
        //   title: "History",
        //   url: "#",
        // },
        // {
        //   title: "Starred",
        //   url: "#",
        // },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: User2,
      items: [
        // {
        //   title: "Genesis",
        //   url: "#",
        // },
        // {
        //   title: "Explorer",
        //   url: "#",
        // },
        // {
        //   title: "Quantum",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Trades",
      url: "/dashboard/trades",
      icon: Handshake,
    },
    {
      title: "Offers",
      url: "/dashboard/offers",
      icon: Coins,
    },
    {
      title: "Swaps",
      url: "/dashboard/swaps",
      icon: ArrowLeftRight,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: Banknote,
    },
    {
      title: "Payment Methods",
      url: "/dashboard/payment_method",
      icon: CreditCard,
    },
    {
      title: "Disputes",
      url: "/dashboard/disputes",
      icon: ShieldAlert,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        // {
        //   title: "General",
        //   url: "#",
        // },
        // {
        //   title: "Team",
        //   url: "#",
        // },
        // {
        //   title: "Billing",
        //   url: "#",
        // },
        // {
        //   title: "Limits",
        //   url: "#",
        // },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <Image
                  className="bg-sidebar-primary object-contain text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg"
                  src="/images/app-icon.jpg"
                  alt="app-logo"
                  width={2000}
                  height={2000}
                  priority
                  quality={1}
                />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Evolve2p</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email: user?.email || "",
            name: "Admin",
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
