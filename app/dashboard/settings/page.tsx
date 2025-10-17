"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/utils";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [performing, setPerforming] = useState("");
  const [settings, setSettings] = useState({
    depositLimit: "",
    withdrawalLimit: "",
    sendCryptoFee: "",
    tradingFee: "",
    maintenanceMode: false,
    supportEmail: "",
    supportPhoneNumber: "",
  });

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (section: string) => {
    if (section === "Daily Limits") {
      setPerforming(section);
      const res = await updateSettings({
        depositLimit: Number(settings.depositLimit),
        withdrawalLimit: Number(settings.withdrawalLimit),
      });

      if (res?.error) {
        setPerforming("");
        toast.error(res?.message || "Failed to update daily limits.");
        return;
      }

      if (res?.success) {
        setPerforming("");
        toast.success("Daily limits updated successfully!");
        setSettings(res?.settings);
      }
    } else if (section === "Fees") {
      setPerforming(section);
      const res = await updateSettings({
        sendCryptoFee: Number(settings.sendCryptoFee),
        tradingFee: Number(settings.tradingFee),
      });

      if (res?.error) {
        setPerforming("");
        toast.error(res?.message || "Failed to update fees.");
        return;
      }

      if (res?.success) {
        setPerforming("");
        toast.success("Fees updated successfully!");
        setSettings(res?.settings);
      }
    } else if (section === "Maintenance Mode") {
      setPerforming(section);
      const res = await updateSettings({
        maintenanceMode: settings.maintenanceMode,
      });

      if (res?.error) {
        setPerforming("");
        toast.error(res?.message || "Failed to update fees.");
        return;
      }

      if (res?.success) {
        setPerforming("");
        toast.success("Maintenance Mode updated successfully!");
        setSettings(res?.settings);
      }
    } else if (section === "Support Info") {
      setPerforming(section);
      const res = await updateSettings({
        supportEmail: settings.supportEmail,
        supportPhoneNumber: settings.supportPhoneNumber,
      });

      if (res?.error) {
        setPerforming("");
        toast.error(res?.message || "Failed to update fees.");
        return;
      }

      if (res?.success) {
        setPerforming("");
        toast.success("Support Info updated successfully!");
        setSettings(res?.settings);
      }
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getSettings();

      if (res?.error) {
        setLoading(false);
        toast.error(res?.message || "Failed to load settings.");
        return;
      }

      if (res?.success) {
        setLoading(false);
        setSettings(res?.settings);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-8 space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight mb-8">
        ⚙️ Admin Settings
      </h1>

      {/* ================= DAILY LIMITS ================= */}
      <Card className="bg-[#131826] border border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-200">
            💰 Daily Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Deposit Limit (USD)</Label>
              <Input
                type="number"
                placeholder="5000"
                value={settings.depositLimit}
                onChange={(e) => handleChange("depositLimit", e.target.value)}
                className="bg-[#1c2333] border-gray-700"
              />
            </div>
            <div>
              <Label>Withdraw Limit (USD)</Label>
              <Input
                type="number"
                placeholder="2000"
                value={settings.withdrawalLimit}
                onChange={(e) =>
                  handleChange("withdrawalLimit", e.target.value)
                }
                className="bg-[#1c2333] border-gray-700"
              />
            </div>
          </div>
          <Button
            disabled={performing == "Daily Limits"}
            onClick={() => handleSubmit("Daily Limits")}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            {performing == "Daily Limits" ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Save Daily Limits"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ================= FEES ================= */}
      <Card className="bg-[#131826] border border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-200">💸 Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Send Crypto Fee (%)</Label>
              <Input
                type="number"
                placeholder="0.5"
                value={settings.sendCryptoFee}
                onChange={(e) => handleChange("sendCryptoFee", e.target.value)}
                className="bg-[#1c2333] border-gray-700"
              />
            </div>
            <div>
              <Label>Trading Fee (%)</Label>
              <Input
                type="number"
                placeholder="1.0"
                value={settings.tradingFee}
                onChange={(e) => handleChange("tradingFee", e.target.value)}
                className="bg-[#1c2333] border-gray-700"
              />
            </div>
          </div>
          <Button
            onClick={() => handleSubmit("Fees")}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            {performing == "Fees" ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              " Save Fees"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ================= MAINTENANCE MODE ================= */}
      <Card className="bg-[#131826] border border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-200">
            🛠️ Maintenance Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Maintenance Mode</Label>
              <p className="text-sm text-gray-400">
                When enabled, users cannot perform trades or transactions.
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                handleChange("maintenanceMode", checked)
              }
            />
          </div>
          <Button
            onClick={() => handleSubmit("Maintenance Mode")}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            {performing == "Maintenance Mode" ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Save Maintenance Mode"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ================= SUPPORT INFO ================= */}
      <Card className="bg-[#131826] border border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-200">
            📞 Support Contact Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Support Email</Label>
              <Input
                type="email"
                placeholder="support@jptech.com"
                value={settings.supportEmail}
                onChange={(e) => handleChange("supportEmail", e.target.value)}
                className="bg-[#1c2333] border-gray-700"
              />
            </div>
            <div>
              <Label>Support Phone</Label>
              <Input
                type="text"
                placeholder="+1 234 567 8900"
                value={settings.supportPhoneNumber}
                onChange={(e) =>
                  handleChange("supportPhoneNumber", e.target.value)
                }
                className="bg-[#1c2333] border-gray-700"
              />
            </div>
          </div>
          <Button
            onClick={() => handleSubmit("Support Info")}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            {performing == "Support Info" ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              " Save Support Info"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
