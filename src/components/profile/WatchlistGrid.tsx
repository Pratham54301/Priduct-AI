"use client";

import { Star, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { WatchlistItem } from "@/types/profile";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function WatchlistGrid() {
  const auth = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (!auth?.token) return;
    fetch("/api/watchlist", {
      headers: { Authorization: `Bearer ${auth?.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setWatchlist(data);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load watchlist"); setLoading(false); });
  }, [auth?.token]);

  const removeItem = async (id: string) => {
    await fetch(`/api/watchlist/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth?.token}` },
    });
    setWatchlist((prev) => prev.filter((item) => item._id !== id));
  };

  if (loading) return (
    <div className="bg-card rounded-lg shadow p-6 dark:bg-[#18181b] w-full max-w-2xl mx-auto">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
  if (error) return (
    <div className="bg-red-900 text-red-200 p-4 rounded mb-4 w-full max-w-2xl mx-auto">
      {error}
    </div>
  );

  return (
    <div className="bg-card rounded-lg shadow p-6 dark:bg-[#18181b] w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-white">Watchlist</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {watchlist.map((item) => (
          <div key={item._id} className="flex items-center justify-between bg-[#232323] rounded p-3">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400" />
              <span className="text-white">{item.ticker}</span>
            </div>
            <Button size="sm" variant="destructive" onClick={() => removeItem(item._id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 