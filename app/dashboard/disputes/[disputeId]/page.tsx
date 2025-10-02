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
import { getDispute } from "@/lib/utils";
import { formatId } from "@/constant";

// Mock dispute data
// const dispute = {
//   id: "DISP-12345",
//   status: "OPEN",
//   reason: "Payment not received",
//   description:
//     "Buyer claims to have sent the payment but seller has not confirmed.",
//   openedBy: { id: "u1", username: "john_doe" },
//   trade: {
//     id: "TRADE-98765",
//     buyer: { id: "u1", username: "john_doe" },
//     seller: { id: "u2", username: "jane_smith" },
//     amountFiat: 500,
//     amountCrypto: 0.01,
//     currency: "BTC",
//   },
//   evidence: [
//     { id: 1, fileName: "screenshot1.png", url: "/placeholder.svg" },
//     { id: 2, fileName: "receipt.pdf", url: "/placeholder.svg" },
//   ],
//   createdAt: "2025-09-25T14:30:00Z",
// };

export default function DisputeDetailsPage() {
  const router = useRouter();
  const [openResolve, setOpenResolve] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
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

  const handleResolve = async (action: "buyer" | "seller") => {
    setResolving(true);
    await new Promise((r) => setTimeout(r, 1200)); // mock delay

    toast.success(
      `Dispute resolved: Escrow released to ${
        action === "buyer" ? "Buyer" : "Seller"
      }`
    );
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
              <p>
                <strong>Buyer:</strong> @{dispute?.trade?.buyer?.username}
              </p>
              <p>
                <strong>Seller:</strong> @{dispute?.trade?.seller?.username}
              </p>
              <p>
                <strong>Amount:</strong> {dispute?.trade?.offer?.currency}{" "}
                {dispute?.trade?.amountFiat} ({dispute?.trade?.amountCrypto}{" "}
                {dispute?.trade?.offer?.crypto})
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
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => toast.error("Dispute cancelled")}
              >
                <XCircle size={16} />
                Cancel Dispute
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                onClick={() => setOpenResolve(true)}
              >
                <CheckCircle2 size={16} />
                Resolve Dispute
              </Button>
              {/* <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => toast.info("Escrow action triggered")}
              >
                <ArrowLeftRight size={16} />
                Escrow Actions
              </Button> */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resolve Dispute Modal */}
      <Dialog open={openResolve} onOpenChange={setOpenResolve}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add a resolution note and choose who should receive the escrowed
              funds.
            </p>
            <Textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Write resolution notes..."
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setOpenResolve(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={resolving}
              onClick={() => handleResolve("buyer")}
            >
              {resolving ? "Resolving..." : "Award Buyer"}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={resolving}
              onClick={() => handleResolve("seller")}
            >
              {resolving ? "Resolving..." : "Award Seller"}
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
