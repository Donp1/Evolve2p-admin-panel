"use client";
import { base_url, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DarkModeToggle } from "./DarkModeToggle";
import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const { openAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      router.replace("/dashboard");
    }
  }, []);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(base_url + "/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 👈 important!
        },
        body: JSON.stringify({
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        }),
      });

      const data = await res.json();

      if (data?.error) {
        openAlert({
          actions: [{ label: "Close" }],
          message: data?.message,
          title: "Error",
          type: "error",
        });
        setLoading(false);
        return;
      }

      if (data?.success) {
        localStorage.setItem("authToken", data?.accessToken);
        openAlert({
          actions: [
            {
              label: "Go to Dashboard",
              onClick() {
                router.replace("/dashboard");
              },
            },
          ],
          message: data?.message,
          title: "Success",
          type: "success",
        });

        setLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
      return openAlert({
        type: "error",
        actions: [{ label: "Close" }],
        title: "Error",
        message: String(error),
      });
      setLoading(false);
    } finally {
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={(e) => handleLoginSubmit(e)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back Admin</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Evolve2p account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  ref={emailRef}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  ref={passwordRef}
                  id="password"
                  type="password"
                  placeholder="*******"
                  required
                />
              </div>
              <Button disabled={loading} type="submit" className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
            </div>
          </form>
          <div className="relative hidden md:block  ">
            <img
              src="/images/app-icon.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
