"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { Toaster } from "sonner";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.replace("/");
    }
  }, [router]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="flex flex-1 w-full justify-end px-8">
            <div className="self-end">
              <Bell size={20} />
            </div>
          </div>
        </header>

        <div className="flex overflow-y-auto flex-1 flex-col gap-4 p-4 pt-5">
          <Toaster richColors position="top-right" closeButton />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
