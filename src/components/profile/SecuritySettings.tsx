"use client"; 

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { SecuritySettings as SecuritySettingsType } from "@/types/profile";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useState } from "react";

export default function SecuritySettings() {
  const auth = useAuth();
  const token = auth?.token;
  const [security, setSecurity] = useState<SecuritySettingsType>({ twoFAEnabled: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // const { toast } = useToast();

  const handleToggle2FA = async (enabled: boolean) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await fetch("/api/me/2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled }),
      });
      setSecurity((prevSecurity: SecuritySettingsType) => ({ ...prevSecurity, twoFAEnabled: enabled }));
      setSuccess(true);
      // toast({ title: "2FA setting updated!", variant: "success" });
    } catch {
      setError("Failed to update 2FA setting");
      // toast({ title: "Failed to update 2FA setting", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="bg-card rounded-lg shadow p-6 dark:bg-[#18181b]">
      <h2 className="text-lg font-semibold mb-4 text-white">Security</h2>
      <div className="flex items-center justify-between mb-4">
        <span className="text-white">Two-Factor Authentication</span>
        <Switch
          checked={security.twoFAEnabled}
          onCheckedChange={handleToggle2FA}
          disabled={loading}
        />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-500 text-sm mb-2">2FA setting updated!</div>}
      <Button variant="destructive">Logout from all devices</Button>
    </div>
  );
} 