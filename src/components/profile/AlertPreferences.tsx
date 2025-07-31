'use client';

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { AlertPreferences as AlertPreferencesType } from "@/types/profile";

export default function AlertPreferences() {
  const [prefs, setPrefs] = useState<AlertPreferencesType>({ dailyEmail: true, sms: false });

  // Add API integration as needed

  return (
    <div className="bg-card rounded-lg shadow p-6 dark:bg-[#18181b]">
      <h2 className="text-lg font-semibold mb-4 text-white">Alert Preferences</h2>
      <div className="flex items-center justify-between mb-4">
        <span className="text-white">Daily Email Alerts</span>
        <Switch checked={prefs.dailyEmail} onCheckedChange={v => setPrefs(p => ({ ...p, dailyEmail: v }))} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white">SMS Notifications</span>
        <Switch checked={prefs.sms} onCheckedChange={v => setPrefs(p => ({ ...p, sms: v }))} />
      </div>
    </div>
  );
} 