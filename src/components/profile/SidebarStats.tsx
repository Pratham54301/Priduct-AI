"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Stats } from "@/types/profile";
import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarStats() {
  const auth = useAuth();
  const token = auth?.token;
  const [stats, setStats] = useState<Stats>({ accuracy: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (!token) return;
    fetch("/api/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => { setError("Failed to load stats"); setLoading(false); });
  }, [token]);

  if (loading) return (
    <div className="bg-card rounded-lg shadow p-6 dark:bg-[#18181b] w-full max-w-xs mx-auto">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-4 w-40 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
  if (error) return (
    <div className="bg-red-900 text-red-200 p-4 rounded mb-4 w-full max-w-xs mx-auto">
      {error}
    </div>
  );

  return (
    <div className="bg-card rounded-lg shadow p-6 dark:bg-[#18181b] w-full max-w-xs mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-white">Your Stats</h2>
      <div className="mb-2 text-white">Prediction Accuracy: <span className="font-bold">{stats.accuracy}%</span></div>
      <div className="mb-2 text-white">Total Predictions: <span className="font-bold">{stats.total}</span></div>
    </div>
  );
} 