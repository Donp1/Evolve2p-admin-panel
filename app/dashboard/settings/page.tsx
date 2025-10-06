"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    depositLimit: "",
    withdrawLimit: "",
    sendFee: "",
    tradeFee: "",
    maintenanceMode: false,
    supportEmail: "",
    supportPhone: "",
  });

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (section: string) => {
    toast.success(`${section} updated successfully!`);
  };

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
                value={settings.withdrawLimit}
                onChange={(e) => handleChange("withdrawLimit", e.target.value)}
                className="bg-[#1c2333] border-gray-700"
              />
            </div>
          </div>
          <Button
            onClick={() => handleSubmit("Daily Limits")}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Save Daily Limits
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
                value={settings.sendFee}
                onChange={(e) => handleChange("sendFee", e.target.value)}
                className="bg-[#1c2333] border-gray-700"
              />
            </div>
            <div>
              <Label>Trading Fee (%)</Label>
              <Input
                type="number"
                placeholder="1.0"
                value={settings.tradeFee}
                onChange={(e) => handleChange("tradeFee", e.target.value)}
                className="bg-[#1c2333] border-gray-700"
              />
            </div>
          </div>
          <Button
            onClick={() => handleSubmit("Fees")}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Save Fees
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
            Save Maintenance Mode
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
                value={settings.supportPhone}
                onChange={(e) => handleChange("supportPhone", e.target.value)}
                className="bg-[#1c2333] border-gray-700"
              />
            </div>
          </div>
          <Button
            onClick={() => handleSubmit("Support Info")}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Save Support Info
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
