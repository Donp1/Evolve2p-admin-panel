"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  FileText,
  MessageSquare,
  ArrowLeftRight,
  ShieldAlert,
  Loader2Icon,
} from "lucide-react";
import ChatDialog from "@/components/ChatDialog";
import { getDispute, resolveDispute } from "@/lib/utils";
import { formatId } from "@/constant";
import Link from "next/link";

export default function DisputeDetailsPage() {
  const router = useRouter();
  const [openResolve, setOpenResolve] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dispute, setDispute] = useState<any>(null);

  const params = useParams();
  const disputeId = params?.disputeId as string;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getDispute(disputeId);
      if (res?.error) {
        setLoading(false);
        toast.error(res?.message);
        return;
      }

      if (res?.success) {
        setLoading(false);
        setDispute(res?.dispute);
        console.log(res?.dispute?.trade?.chat);
      }
    })();
  }, []);

  const handleResolve = async (action: "BUYER" | "SELLER") => {
    setResolving(true);
    const res = await resolveDispute(disputeId, action);
    if (res?.error) {
      toast.error(res?.message);
      setResolving(false);
      return;
    }

    if (res?.success) {
      toast.success(
        `Dispute resolved: Escrow released to ${
          action === "BUYER" ? "Buyer" : "Seller"
        }`
      );
    }

    setResolving(false);
    setOpenResolve(false);
    router.refresh();
  };

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  return (
    <div className="p-8 space-y-8 bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-yellow-500" />
            Dispute{" "}
            <span className="text-muted-foreground">
              #{formatId(dispute?.id)}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage and resolve this trade dispute
          </p>
        </div>
        <Badge
          className={`px-4 py-1 text-sm ${
            dispute?.status === "OPEN"
              ? "bg-yellow-500 text-black"
              : "bg-green-600 text-white"
          }`}
        >
          {dispute?.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Summary */}
          <Card className="bg-card/70 backdrop-blur-md border border-border/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              <p>
                <strong>Opened By:</strong> @{dispute?.user?.username}
              </p>
              <p>
                <strong>Opened At:</strong>{" "}
                {new Date(dispute?.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {dispute?.status}
              </p>
            </CardContent>
          </Card>

          {/* Trade Info */}
          <Card className="bg-card/70 backdrop-blur-md border border-border/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Trade Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              <p>
                <strong>Trade ID:</strong> {formatId(dispute?.trade?.id)}
              </p>
              <div>
                <strong>Buyer:</strong>{" "}
                <Link
                  className=""
                  href={`/dashboard/users/${dispute?.trade?.buyer?.id}`}
                >
                  @{dispute?.trade?.buyer?.username}
                </Link>
              </div>
              <div>
                <strong>Seller:</strong>{" "}
                <Link
                  className=""
                  href={`/dashboard/users/${dispute?.trade?.buyer?.id}`}
                >
                  @{dispute?.trade?.seller?.username}
                </Link>
              </div>
              <p>
                <strong>Amount:</strong> {dispute?.trade?.offer?.currency}{" "}
                {Number(dispute?.trade?.amountFiat).toLocaleString()} (
                {dispute?.trade?.amountCrypto} {dispute?.trade?.offer?.crypto})
              </p>
            </CardContent>
          </Card>

          {/* Dispute Details */}
          <Card className="bg-card/70 backdrop-blur-md border border-border/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Dispute Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Reason:</strong> {dispute?.reason}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {dispute?.description ? dispute?.description : "No description"}
              </p>
              <div>
                <strong>Evidence:</strong>
                <div className="flex flex-wrap gap-3 mt-3">
                  <a
                    href={dispute?.evidence}
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border/40 transition text-sm"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Proof
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Actions */}
        <div className="space-y-6">
          <Card className="bg-card/70 backdrop-blur-md border border-border/50 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setOpenChat(true)}
              >
                <MessageSquare size={16} />
                View Chat
              </Button>

              {dispute?.status === "OPEN" && (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  onClick={() => setOpenResolve(true)}
                >
                  <CheckCircle2 size={16} />
                  Resolve Dispute
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resolve Dispute Modal */}
      <Dialog open={openResolve} onOpenChange={setOpenResolve}>
        <DialogContent className="sm:max-w-md dark:bg-neutral-900">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-semibold">
              Resolve Dispute
            </DialogTitle>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Please choose who should receive the funds from escrow. This
              action is final and cannot be undone.
            </p>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white h-20 rounded-xl flex flex-col gap-1 shadow-lg"
              disabled={resolving}
              onClick={() => handleResolve("BUYER")}
            >
              {resolving ? "Resolving..." : "✅ Award Buyer"}
              <span className="text-xs opacity-80">Funds go to buyer</span>
            </Button>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white h-20 rounded-xl flex flex-col gap-1 shadow-lg"
              disabled={resolving}
              onClick={() => handleResolve("SELLER")}
            >
              {resolving ? "Resolving..." : "🏷️ Award Seller"}
              <span className="text-xs opacity-80">Funds go to seller</span>
            </Button>
          </div>

          <DialogFooter className="flex justify-between mt-4">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setOpenResolve(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      <ChatDialog
        buyerId={dispute?.trade?.buyer?.id}
        sellerId={dispute?.trade?.seller?.id}
        chat={dispute?.trade?.chat}
        onOpenChange={setOpenChat}
        open={openChat}
      />
    </div>
  );
}
