'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { Prediction } from "@/types/profile";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
export default function HistoryTable() {
  const auth = useAuth();
  const [history, setHistory] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (!auth?.token) return;
    fetch("/api/predictions", {
      headers: { Authorization: `Bearer ${auth?.token}` },
    })
      .then((res) => res.json() as Promise<Prediction[]>)
      .then((data) => { setHistory(data); setLoading(false); })
      .catch(() => { setError("Failed to load history"); setLoading(false); });
  }, [auth?.token]);

  if (loading) return (
    <div className="bg-card rounded-lg shadow p-6 dark:bg-[#18181b] w-full max-w-2xl mx-auto">
      <Skeleton className="h-6 w-40 mb-4" />
      <Skeleton className="h-10 w-full mb-2" />
      <Skeleton className="h-10 w-full mb-2" />
      <Skeleton className="h-10 w-1/2" />
    </div>
  );
  if (error) return (
    <div className="bg-red-900 text-red-200 p-4 rounded mb-4 w-full max-w-2xl mx-auto">
      {error}
    </div>
  );

  return (
    <div className="bg-card rounded-lg shadow p-6 dark:bg-[#18181b] w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-white">Prediction History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{item.ticker}</TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{item.accuracy || "-"}</TableCell>
              <TableCell>{item.result || "-"}</TableCell>
              <TableCell>{item.type || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 