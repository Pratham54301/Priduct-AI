"use client";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/types/profile";
import { useState } from "react";

export default function SubscriptionCard() {
  // Placeholder data
  const [sub, setSub] = useState<Subscription>({
    plan: "Pro",
    usage: 42,
    maxUsage: 100,
    renewalDate: "2024-12-31",
  });

  return (
    <div className="bg-card rounded-lg shadow p-6 dark:bg-[#18181b]">
      <h2 className="text-lg font-semibold mb-4 text-white">Subscription</h2>
      <div className="mb-2 text-white">Plan: <span className="font-bold">{sub.plan}</span></div>
      <div className="mb-2 text-white">Renewal: {sub.renewalDate}</div>
      <div className="mb-4 text-white">Usage: {sub.usage} / {sub.maxUsage} predictions this month</div>
      <Button variant="secondary" className="mr-2">Upgrade</Button>
      <Button variant="destructive">Cancel Subscription</Button>
    </div>
  );
} 