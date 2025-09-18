"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { LineChartInteractive } from "@/components/LineChart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAlert } from "@/hooks/useAlert";
import { useAuthStore } from "@/hooks/useAuth";
import { checkToken } from "@/lib/utils";
import { Bell, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const { openAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  useLayoutEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (!storedToken) {
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await checkToken();
      if (res?.error) {
        openAlert({
          actions: [
            {
              label: "Login",
              onClick() {
                router.replace("/");
              },
            },
          ],
          message: res?.message,
          title: "Error",
          type: "error",
        });
        setLoading(false);
        return;
      }

      if (res?.success) {
        setUser(res?.user);
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader className="animate-spin size-10" />
      </div>
    );
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
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
