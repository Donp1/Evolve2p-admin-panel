"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Copy,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Loader2Icon,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { getTransaction } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { copyToClipboard, formatAddress } from "@/constant";

export default function TransactionDetails() {
  const router = useRouter();

  const { transactionId } = useParams();

  const [loading, setLoading] = React.useState(false);
  const [transaction, setTransaction] = React.useState<any>(null);

  // Example data (replace with your real prop or API call)

  //   const transaction = {
  //     id: "txn-2e3f-789c-001",
  //     type: "WITHDRAWAL",
  //     amount: 150.75,
  //     toAddress: "0x8f5a...3cd8",
  //     fromAddress: "0x49b7...d21e",
  //     txHash: "0xabc123def456...",
  //     status: "COMPLETED",
  //     createdAt: "2025-10-07T12:42:31.000Z",
  //     wallet: {
  //       currency: "USDT",
  //       address: "0x49b7...d21e",
  //     },
  //     user: {
  //       name: "Jane Doe",
  //       email: "jane@paxful.com",
  //       username: "janedoe",
  //       country: "Nigeria",
  //     },
  //   };

  useEffect(() => {
    (async () => {
      if (!transactionId) {
        toast.error("Transaction ID is missing");
        router.back();
        return;
      }

      setLoading(true);
      const res = await getTransaction(transactionId as string);
      if (res?.error) {
        setLoading(false);
        toast.error(res?.message || "Failed to fetch transaction");
        router.back();
        return;
      }

      if (res?.success) {
        console.log(res);
        setTransaction(res?.transaction);
        setLoading(false);
      }
    })();
  }, [transactionId]);

  const isIncoming =
    transaction?.type === "DEPOSIT" ||
    transaction?.type === "ESCROW_IN" ||
    transaction?.type === "TRADE_RELEASE";

  const statusColors = {
    PENDING: "text-yellow-400 bg-yellow-400/10",
    COMPLETED: "text-green-400 bg-green-400/10",
    FAILED: "text-red-400 bg-red-400/10",
  };

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b0d10] text-gray-100 px-6 py-10 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-white">
          Transaction Details
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-4xl bg-[#121417] rounded-2xl shadow-xl p-8 border border-gray-800">
        {/* User Info */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                @{transaction?.user?.username}
              </h2>
            </div>
          </div>

          <div className="text-right text-sm text-gray-400">
            <p>{transaction?.user?.email}</p>
            <p className="text-xs text-gray-500">
              {transaction?.user?.country}
            </p>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <div className="bg-[#1a1d22] rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Transaction Type</p>
              {isIncoming ? (
                <ArrowDownRight className="text-green-400 w-5 h-5" />
              ) : (
                <ArrowUpRight className="text-red-400 w-5 h-5" />
              )}
            </div>
            <p className="text-xl font-semibold text-white mt-2">
              {transaction?.type.replace("_", " ")}
            </p>
          </div>

          <div className="bg-[#1a1d22] rounded-xl p-5">
            <p className="text-sm text-gray-400 mb-1">Amount</p>
            <p className="text-2xl font-semibold text-white">
              {transaction?.amount} {transaction?.wallet?.currency}
            </p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-[#1a1d22] rounded-xl p-5">
            <p className="text-sm text-gray-400">From Address</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-mono text-sm text-gray-300">
                {formatAddress(transaction?.fromAddress)}
              </span>
              <Button
                className="cursor-pointer"
                onClick={() => copyToClipboard(transaction?.fromAddress)}
                variant={"link"}
              >
                <Copy
                  size={16}
                  className="text-gray-500 hover:text-white cursor-pointer"
                />
              </Button>
            </div>
          </div>

          <div className="bg-[#1a1d22] rounded-xl p-5">
            <p className="text-sm text-gray-400">To Address</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-mono text-sm text-gray-300">
                {formatAddress(transaction?.toAddress)}
              </span>
              <Button
                className="cursor-pointer"
                onClick={() => copyToClipboard(transaction?.toAddress)}
                variant={"link"}
              >
                <Copy
                  size={16}
                  className="text-gray-500 hover:text-white cursor-pointer"
                />
              </Button>
            </div>
          </div>
        </div>

        {/* TX Hash + Date */}
        <div className="mt-8 bg-[#1a1d22] rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
          <div>
            <p className="text-sm text-gray-400">Transaction Hash</p>
            <p className="font-mono text-sm text-gray-300 truncate max-w-md">
              {transaction?.txHash || "N/A"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            {new Date(transaction?.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Status + Wallet */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              statusColors[transaction?.status as keyof typeof statusColors]
            }`}
          >
            {transaction?.status}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Wallet className="w-5 h-5 text-purple-400" />
            <span className="text-sm">
              Wallet: {transaction?.wallet?.currency} —{" "}
              {formatAddress(transaction?.wallet?.address)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
