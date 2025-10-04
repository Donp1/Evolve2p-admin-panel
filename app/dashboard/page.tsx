"use client";

import { LineChartInteractive } from "@/components/LineChart";
import { MostTradedAssetsChart } from "@/components/MostTradedChart";
import { PaymentMethodsChart } from "@/components/PaymentMethodChart";
import { TradeStatusChart } from "@/components/TradeStatusChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserGrowthChart from "@/components/UserGrowthChart";
import { TopCountriesChart } from "@/components/UsersByCountriesChart";
import { VerificationChart } from "@/components/VerifiedChart";
import { useAlert } from "@/hooks/useAlert";
import { useAuthStore } from "@/hooks/useAuth";
import { checkToken, getOverview } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ✅ Reusable stat card
function StatCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <Card
      className={`flex aspect-video flex-col items-center justify-center gap-2 text-center ${
        accent || ""
      }`}
    >
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <h3 className="font-extrabold text-4xl tracking-wide">{value}</h3>
    </Card>
  );
}

export default function Page() {
  const { openAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const checkTokenRes = await checkToken();
        if (checkTokenRes?.error) {
          localStorage.clear();
          toast.error("Session has expired kindly login.");
          router.replace("/");
          return;
        }

        if (checkTokenRes?.success) {
          setUser(checkTokenRes?.user);
        }

        const res = await getOverview();

        if (res?.error) {
          toast.error(res?.message || "Something went wrong.");
          return;
        }

        setOverview(res);
      } catch (error: any) {
        toast.error(error.message || "Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  const { users, trades, disputes, analytics } = overview || {};

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Users" value={users?.total ?? 0} />
        <StatCard title="KYC Approved" value={users?.verified ?? 0} />
        <StatCard title="KYC Pending" value={users?.unverified ?? 0} />
        <StatCard
          title="Trades"
          value={trades?.total ?? 0}
          accent="border border-green-300"
        />
        <StatCard
          title="Disputes"
          value={disputes?.open ?? 0}
          accent="border border-red-300"
        />
      </div>

      {/* Charts */}
      <UserGrowthChart growthData={analytics?.userGrowth || []} />
      <TopCountriesChart countryData={analytics?.topCountries || []} />

      <div className="grid gap-4 md:grid-cols-2">
        <VerificationChart
          verified={users?.verified ?? 0}
          unverified={users?.unverified ?? 0}
        />
        <TradeStatusChart rawData={trades} />
        <MostTradedAssetsChart rawData={analytics?.mostTradedAssets || []} />
        <PaymentMethodsChart
          paymentMethodsData={analytics?.paymentMethods || []}
        />
      </div>
    </div>
  );
}
