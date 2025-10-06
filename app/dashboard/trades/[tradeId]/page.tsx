"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  DollarSign,
  Shield,
  User,
  FileText,
  Loader2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cancleTrade, getTrade } from "@/lib/utils";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { formatId } from "@/constant";

const tradeDemo = {
  id: "8c1b72b1-0a3e-4f9d-b8b5-3e8e5c25fcd2",
  buyerId: "user-buyer-123",
  sellerId: "user-seller-456",
  offerId: "offer-789",
  status: "PAID",
  amountFiat: 250.0,
  amountCrypto: 0.0035,
  escrowReleased: false,
  paymentProof: "https://example.com/payment-proof.png",
  createdAt: "2025-10-01T12:34:56.000Z",
  updatedAt: "2025-10-02T09:45:21.000Z",
  completedAt: null,
  canceledAt: null,
  expiresAt: "2025-10-05T12:34:56.000Z",
  buyer: {
    id: "user-buyer-123",
    name: "Alice Johnson",
    email: "alice@example.com",
    username: "alice01",
  },
  seller: {
    id: "user-seller-456",
    name: "Bob Williams",
    email: "bob@example.com",
    username: "bobTrader",
  },
  offer: {
    id: "offer-789",
    title: "Sell 0.01 BTC for USD",
    currency: "USD",
    crypto: "BTC",
    rate: 71500.0,
  },
  dispute: [],
  escrow: {
    id: "escrow-222",
    walletAddress: "bc1qxyz12345abcdef...",
    amountHeld: 0.0035,
    released: false,
  },
  chat: {
    id: "chat-555",
    messages: [
      {
        sender: "buyer",
        message: "Hi, I just made the payment.",
        sentAt: "2025-10-02T09:40:00.000Z",
      },
      {
        sender: "seller",
        message: "Got it, I’ll confirm shortly.",
        sentAt: "2025-10-02T09:41:30.000Z",
      },
    ],
  },
};

export default function TradeDetails() {
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState<any>(tradeDemo);
  const [cancelling, setCancelling] = useState(false);
  const [reloading, setReloading] = useState(0);

  const { tradeId } = useParams();

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    PAID: "bg-blue-500/20 text-blue-400",
    COMPLETED: "bg-green-500/20 text-green-400",
    CANCELED: "bg-red-500/20 text-red-400",
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getTrade(tradeId as string);
      if (res?.error) {
        setLoading(false);
        toast.error(res?.message || "Failed to fetch trade data");
        return;
      }

      if (res?.success) {
        setLoading(false);
        setTrade(res?.trade);
        console.log(res?.trade);
      }
    })();
  }, [reloading, tradeId]);

  const handleCancleTrade = async () => {
    setCancelling(true);
    const res = await cancleTrade(tradeId as string);
    if (res?.error) {
      setCancelling(false);
      toast.error(res?.message || "Failed to cancel trade");
      return;
    }

    if (res?.success) {
      setCancelling(false);
      toast.success(res?.message || "Trade cancelled successfully");
      setReloading((prev) => prev + 1);
    }
  };

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Trade Details</h1>
          <Badge className={`${statusColors[trade.status]} px-3 py-1`}>
            {trade.status}
          </Badge>
        </div>

        <Separator className="bg-gray-800" />

        {/* Main Trade Info */}
        <Card className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-indigo-400" /> Trade Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-400">Trade ID</p>
              <p className="font-mono">{formatId(trade.id)}</p>
            </div>
            <div>
              <p className="text-gray-400">Offer Type</p>
              <p>{trade.offer?.type || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-400 flex items-center gap-2">
                Amount (Fiat)
              </p>
              <p className="font-semibold">
                {trade?.offer?.currency}{" "}
                {Number(trade.amountFiat).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Amount (Crypto)</p>
              <p className="font-semibold">
                {trade.amountCrypto} {trade?.offer?.crypto}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Min Limit</p>
              <p className="font-semibold">
                {trade?.offer?.currency}
                {trade.offer?.minLimit
                  ? ` ${Number(trade.offer.minLimit).toLocaleString()}`
                  : " N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Max Limit</p>
              <p className="font-semibold">
                {trade?.offer?.currency}
                {trade.offer?.maxLimit
                  ? ` ${Number(trade.offer.maxLimit).toLocaleString()}`
                  : " N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Trade Duration</p>
              <p className="font-semibold">{trade?.offer?.time}</p>
            </div>
            <div>
              <p className="text-gray-400">Terms</p>
              <p className="font-semibold">
                {trade?.offer?.terms ? trade?.offer?.terms : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Created At
              </p>
              <p>{new Date(trade?.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Last Updated
              </p>
              <p>{new Date(trade.updatedAt).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Buyer & Seller Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-400" /> Buyer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">@{trade.buyer?.username}</p>
              <p className="text-sm text-gray-400">
                ID: {formatId(trade?.buyerId)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-red-400" /> Seller
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">@{trade.seller?.username}</p>
              <p className="text-sm text-gray-400">
                ID: {formatId(trade?.sellerId)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Proof */}
        {trade.paymentProof && (
          <Card className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-400" /> Payment Proof
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={trade.paymentProof}
                alt="Payment Proof"
                className="rounded-lg border border-gray-700 w-full max-w-md"
              />
            </CardContent>
          </Card>
        )}

        {/* Admin Actions */}
        <Card className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              onClick={handleCancleTrade}
              disabled={cancelling}
              variant="destructive"
              className="hover:cursor-pointer"
            >
              {cancelling ? (
                <Loader2Icon className="animate-spin w-4 h-4" />
              ) : (
                " Cancel Trade"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
