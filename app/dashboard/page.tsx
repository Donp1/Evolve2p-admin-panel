"use client";

import { LineChartInteractive } from "@/components/LineChart";
import { MostTradedAssetsChart } from "@/components/MostTradedChart";
import { PaymentMethodsChart } from "@/components/PaymentMethodChart";
import { TradeStatusChart } from "@/components/TradeStatusChart";
import { Button } from "@/components/ui/button";
import UserGrowthChart from "@/components/UserGrowthChart";
import { TopCountriesChart } from "@/components/UsersByCountriesChart";
import { VerificationChart } from "@/components/VerifiedChart";

import { useAlert } from "@/hooks/useAlert";
import { getOverview } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Page() {
  const { openAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [tradesData, setTradesData] = useState<any>(null);
  const [disputes, setDisputes] = useState<any>(null);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState<any[]>([]);
  const [mostTradedAssetsData, setMostTradedAssetsData] = useState<any[]>([]);
  const [countriesData, setCountriesData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getOverview();

      setLoading(false);

      if (res?.error) {
        openAlert({
          type: "error",
          title: "Error",
          message: res?.message || "Something went wrong. Please try again.",
          actions: [{ label: "Close" }],
        });
        setLoading(false);
        return;
      }

      setUserData(res?.users);
      setTradesData(res?.trades);
      setDisputes(res?.disputes);
      setUserGrowth(res?.analytics?.userGrowth);
      setPaymentMethodsData(res?.analytics?.paymentMethods);
      setMostTradedAssetsData(res?.analytics?.mostTradedAssets);
      setCountriesData(res?.analytics?.topCountries);
      console.log(res);
    })();
  }, []);

  if (loading)
    return (
      <div>
        <h1 className="text-center font-bold">Loading...</h1>
      </div>
    );

  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="shadow shadow-[#fff] aspect-video rounded-xl flex flex-col items-center justify-center gap-10">
          <h1 className="font-medium">Total Users</h1>
          <h3 className="font-extrabold text-4xl tracking-wider">
            {userData?.total}
          </h3>
        </div>
        <div className="shadow shadow-[#fff] aspect-video rounded-xl flex flex-col items-center justify-center gap-10">
          <h1 className="font-medium">KYC Approved</h1>
          <h3 className="font-extrabold text-4xl tracking-wider">
            {userData?.verified}
          </h3>
        </div>
        <div className="shadow shadow-[#fff] aspect-video rounded-xl flex flex-col items-center justify-center gap-10">
          <h1 className="font-medium">KYC Pending</h1>
          <h3 className="font-extrabold text-4xl tracking-wider">
            {userData?.unverified}
          </h3>
        </div>
        <div className="shadow shadow-[#b98c8c] aspect-video rounded-xl flex flex-col items-center justify-center gap-10">
          <h1 className="font-medium">Trades</h1>
          <h3 className="font-extrabold text-4xl tracking-wider">
            {tradesData?.total}
          </h3>
        </div>
        <div className="shadow shadow-[#fff] aspect-video rounded-xl flex flex-col items-center justify-center gap-10">
          <h1 className="font-medium">Disputes</h1>
          <h3 className="font-extrabold text-4xl tracking-wider">
            {disputes?.open || 0}
          </h3>
        </div>
      </div>

      {/* <div className="h-auto rounded-xl md:min-h-min">
        <LineChartInteractive />
      </div> */}

      <div className="h-auto rounded-xl md:min-h-min">
        <UserGrowthChart growthData={userGrowth} />
      </div>

      <div className="h-auto rounded-xl md:min-h-min">
        <TopCountriesChart countryData={countriesData} />
      </div>

      {/* Responsive layout for KYC + Trade Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-auto rounded-xl md:min-h-min">
          <VerificationChart
            verified={userData?.verified}
            unverified={userData?.unverified}
          />
        </div>
        <div className="h-auto rounded-xl md:min-h-min">
          <TradeStatusChart rawData={tradesData} />
        </div>
        <div className="h-auto rounded-xl md:min-h-min">
          <MostTradedAssetsChart rawData={mostTradedAssetsData} />
        </div>
        <div className="h-auto rounded-xl md:min-h-min">
          <PaymentMethodsChart paymentMethodsData={paymentMethodsData} />
        </div>
      </div>
    </>
  );
}
