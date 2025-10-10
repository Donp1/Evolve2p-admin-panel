"use client";
import React, { use, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Loader2Icon, User } from "lucide-react";
import { getSwap } from "@/lib/utils";
import { toast } from "sonner";

export default function SwapDetails() {
  const router = useRouter();

  const { swapId } = useParams();
  const [swap, setSwap] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (!swapId) {
        router.push("/dashboard/swaps");
        return;
      }
      setLoading(true);
      const res = await getSwap(swapId as string);
      if (res?.error) {
        setLoading(false);
        setSwap(null);
        toast.error(res?.message || "Failed to fetch swap");
        router.push("/dashboard/swaps");
        return;
      }

      if (res?.success) {
        setLoading(false);
        setSwap(res?.swap);
      }
    })();
  }, [swapId]);

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b0d10] text-gray-100 px-6 py-10 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-white">Swap Details</h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-3xl bg-[#121417] rounded-2xl shadow-lg p-6 border border-gray-800">
        {/* User Info */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                @{swap.user.username}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">{swap.user.email}</p>
            <p className="text-xs text-gray-500">{swap.user.country}</p>
          </div>
        </div>

        {/* Swap Info */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#1a1d22] rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">From Coin</p>
            <p className="text-xl font-semibold text-white">{swap.fromCoin}</p>
            <p className="text-sm text-gray-400 mt-2">
              {swap.fromAmount} {swap.fromCoin}
            </p>
          </div>

          <div className="bg-[#1a1d22] rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">To Coin</p>
            <p className="text-xl font-semibold text-white">{swap.toCoin}</p>
            <p className="text-sm text-gray-400 mt-2">
              {swap.toAmount} {swap.toCoin}
            </p>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-6">
          <ArrowRight className="w-6 h-6 text-purple-400" />
        </div>

        {/* Transaction Info */}
        <div className="bg-[#1a1d22] rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Swap ID</p>
            <p className="text-sm text-gray-300 font-mono">{swap.id}</p>
          </div>
          <div className="flex items-center text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            <p className="text-sm">
              {new Date(swap.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
