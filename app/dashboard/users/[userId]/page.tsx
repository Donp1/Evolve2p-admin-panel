"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  User as UserIcon,
  Flag,
  ShieldCheck,
  ShieldAlert,
  Loader,
  Coins,
  Banknote,
  Scale,
  Loader2Icon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  cancleTrade,
  getUser,
  performOfferAction,
  performUserAction,
  resetUserPassword,
} from "@/lib/utils";
import { useAlert } from "@/hooks/useAlert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/RichTextEditor";
import { toast } from "sonner";

export default function UserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [offers, setOffers] = useState<any>(null);
  const [trades, setTrades] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openSendMail, setOpenSendMail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [isReseting, setIsReseting] = useState(false);
  const [cancelId, setCancelId] = useState("");
  const [reload, setReload] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getUser(userId);

      if (res?.error) {
        setLoading(false);
        toast.error(res?.message || "Failed to fetch user");
        return;
      }

      if (res?.success) {
        setUser(res?.user);
        setTrades([...res?.user?.tradesAsBuyer, ...res?.user?.tradesAsSeller]);
        setOffers(res?.user?.offers);
        setLoading(false);
      }
    })();
  }, [userId, reload]);

  const handleUserAction = async (action: string) => {
    setIsPerformingAction(true);
    const res = await performUserAction(action, userId);
    if (res?.error) {
      setIsPerformingAction(false);
      toast.error(res?.message || "Action failed");
      return;
    }

    if (res?.success) {
      setUser(res?.user);
      toast.success(res?.message || "Action successful");
      setIsPerformingAction(false);
      setReload((prev) => prev + 1);
    }
  };

  const handleResetPassword = async () => {
    setIsReseting(true);
    if (!newPassword || !confirmPassword) {
      setIsReseting(false);
      toast.error("Fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsReseting(false);
      toast.error("Passwords do not match");
      return;
    }
    const res = await resetUserPassword(newPassword, userId);
    if (res?.error) {
      setIsReseting(false);
      toast.error(res?.message || "Unable to reset password");
      return;
    }

    if (res?.success) {
      setIsReseting(false);
      toast.success(res?.message || "Passwored reset successful");
      setOpenResetPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleToggleStatus = async (id: string) => {
    // 1. Optimistically update UI
    setOffers((prev: any) =>
      prev.map((offer: any) =>
        offer.id === id
          ? {
              ...offer,
              status: offer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : offer
      )
    );

    // 2. Decide action type
    const actionType =
      offers.find((offer: any) => offer.id === id)?.status === "ACTIVE"
        ? "inactive"
        : "active";

    try {
      // 3. Call backend
      const res = await performOfferAction(actionType, id);

      if (res?.error) {
        toast.error(res?.message);
        return;
      }

      if (res?.success) {
        toast.success(res?.message);
        return;
      }
    } catch (error) {
      console.error("Failed to update offer:", error);

      // 4. Rollback on error
      setOffers((prev: any) =>
        prev.map((offer: any) =>
          offer.id === id
            ? {
                ...offer,
                status: offer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE", // revert back
              }
            : offer
        )
      );
    }
  };

  const handleCancleTrade = async (tradeId: string) => {
    setCancelId(tradeId);
    const res = await cancleTrade(tradeId);
    if (res?.error) {
      setCancelId("");
      toast.error(res?.message || "Unable to cancel trade");
      return;
    }

    if (res?.success) {
      setCancelId("");
      toast.success(res?.message || "Trade cancelled successfully");
      setReload((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Loader className="animate-spin text-slate-200" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
      <Card className="w-full max-w-5xl shadow-xl border border-slate-700 bg-slate-800/80 backdrop-blur-sm text-slate-100">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14 border border-slate-600">
            <AvatarFallback className="bg-slate-700 text-slate-200 text-lg font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold">
              {user?.username}
            </CardTitle>
            <p className="text-sm text-slate-400">User ID: {user?.id}</p>
          </div>
        </CardHeader>
        <Separator className="bg-slate-700" />

        {/* 🔹 Tabs for Profile / Offers / Trades */}
        <CardContent className="pt-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-lg overflow-hidden border border-slate-700 bg-slate-800/60 backdrop-blur">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white 
                           hover:bg-slate-700/80 transition-all font-semibold text-slate-300"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="offers"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white 
                           hover:bg-slate-700/80 transition-all font-semibold text-slate-300"
              >
                Offers
              </TabsTrigger>
              <TabsTrigger
                value="trades"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white 
                           hover:bg-slate-700/80 transition-all font-semibold text-slate-300"
              >
                Trades
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{user?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Flag className="h-4 w-4 text-slate-400" />
                    <span>{user?.country}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-200">
                    {user?.kycVerified ? (
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-red-500" />
                    )}
                    <span>
                      KYC: {user?.kycVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    <span>Role: {user?.role || "User"}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Offers Tab */}
            <TabsContent value="offers" className="pt-6">
              <div className="space-y-4">
                {offers?.length <= 0 && <h1>No offers at the moment</h1>}
                {offers?.map((offer: any) => (
                  <Card
                    key={offer?.id}
                    className="bg-slate-700/50 border border-slate-600"
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>
                          {offer?.type} {offer?.crypto} for {offer?.currency}
                        </span>
                        <Badge
                          className={`capitalize ${
                            offer?.status === "active"?.toUpperCase()
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {offer?.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-slate-300">
                      <p>
                        <Coins className="inline h-4 w-4 mr-1" /> Margin:{" "}
                        {offer?.margin}%
                      </p>
                      <p>
                        <Banknote className="inline h-4 w-4 mr-1" /> Limits:{" "}
                        {offer?.currency} {offer.minLimit} - {offer?.currency}{" "}
                        {offer.maxLimit}
                      </p>
                      <p>Time: {offer?.time}</p>
                      <p>Payment Method: {offer?.paymentMethod?.name}</p>
                      {offer?.terms && <p>Terms: {offer?.terms}</p>}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        className=""
                        size="sm"
                        variant={
                          offer?.status === "ACTIVE" ? "destructive" : "success"
                        }
                        onClick={() => handleToggleStatus(offer?.id)}
                      >
                        {offer?.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Trades Tab */}
            <TabsContent value="trades" className="pt-6">
              <div className="space-y-4">
                {trades?.length <= 0 && <h1>No Trades at the moment</h1>}
                {trades?.map((trade: any) => (
                  <Card
                    key={trade?.id}
                    className="bg-slate-700/50 border border-slate-600"
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>
                          • {trade?.amountFiat} {trade?.offer?.currency}
                        </span>
                        <Badge
                          className={`capitalize ${
                            trade?.status === "COMPLETED"
                              ? "bg-green-500/20 text-green-400"
                              : trade?.status === "PENDING"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {trade?.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-300 space-y-2">
                      <p>
                        <Scale className="inline h-4 w-4 mr-1" /> Amount Crypto:{" "}
                        {trade?.amountCrypto} {trade?.offer?.crypto}
                      </p>
                      <p>
                        Escrow Released: {trade?.escrowReleased ? "Yes" : "No"}
                      </p>
                      <p>
                        Created: {new Date(trade?.createdAt).toLocaleString()}
                      </p>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        disabled={cancelId != ""}
                        onClick={() => handleCancleTrade(trade?.id)}
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        {cancelId != "" && cancelId == trade?.id ? (
                          <Loader2Icon className="w-4 h-4 animate-spin" />
                        ) : (
                          "Cancel Trade"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* 🔹 User actions */}
        <Separator className="bg-slate-700" />
        <CardFooter className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge
              className={`capitalize px-3 py-1 text-sm ${
                user?.status?.toLowerCase() === "active"
                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                  : user?.status?.toLowerCase() === "suspended"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
              }`}
            >
              {user?.status}
            </Badge>
            <span className="text-xs text-slate-400">
              Joined {new Date(user?.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setOpenSendMail(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Send Email
            </Button>
            <Button
              onClick={() => setOpenResetPassword(true)}
              variant="outline"
              className="border-slate-500 text-slate-200"
            >
              Reset Password
            </Button>
            {user?.status?.toLowerCase() === "active" ? (
              <Button
                disabled={isPerformingAction}
                onClick={() => handleUserAction("suspend")}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isPerformingAction ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  "Suspend User"
                )}
              </Button>
            ) : (
              <Button
                disabled={isPerformingAction}
                onClick={() => handleUserAction("activate")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isPerformingAction ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  "Activate User"
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* 🔹 Send Email Modal */}
      <Dialog open={openSendMail} onOpenChange={setOpenSendMail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email to {user?.username}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="subject" className="mb-2">
                Subject
              </Label>
              <Input id="subject" placeholder="Enter subject" />
            </div>

            <div>
              <Label htmlFor="message" className="mb-2">
                Message
              </Label>

              <Textarea
                id="message"
                className="w-full rounded-md border border-slate-600 bg-slate-800 p-2 text-slate-100"
                rows={10}
                placeholder="Write your message..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenSendMail(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🔹 Reset Password Modal */}
      <Dialog open={openResetPassword} onOpenChange={setOpenResetPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password for {user?.username}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Enter a new password for this user. Make sure it is strong and
              confirm it below.
            </p>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <br />
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setOpenResetPassword(false)}>Cancel</Button>
            <Button
              disabled={isReseting}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={handleResetPassword}
            >
              {isReseting ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
