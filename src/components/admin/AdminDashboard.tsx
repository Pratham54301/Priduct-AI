'use client';

import * as React from 'react';
import {
  Activity,
  BarChart3,
  Users,
  Crown,
  Sparkles,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { adminService } from '@/services/adminService';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function AdminDashboard() {
  const [usersCount, setUsersCount] = React.useState(0);
  const [premiumCount, setPremiumCount] = React.useState(0);
  const [predictionCount, setPredictionCount] = React.useState(0);
  const [activeUsersToday, setActiveUsersToday] = React.useState(0);
  const [trendData, setTrendData] = React.useState<Array<{ date: string; users: number; predictions: number }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [recentLogs, setRecentLogs] = React.useState<Array<{ _id: string; symbol: string; createdAt: string; customer?: { email?: string } }>>([]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, logsRes] = await Promise.all([
          adminService.getDashboardAnalytics(),
          adminService.getPredictionLogs(new URLSearchParams({ page: '1', limit: '20' })),
        ]);
        setUsersCount(analyticsRes.data.totalUsers || 0);
        setPremiumCount(analyticsRes.data.premiumUsers || 0);
        setPredictionCount(analyticsRes.data.totalPredictions || 0);
        setActiveUsersToday(analyticsRes.data.activeUsersToday || 0);
        setTrendData(analyticsRes.data.trends || []);
        setRecentLogs(
          (logsRes.data || []).slice(0, 8).map((p) => ({
            _id: p._id,
            symbol: p.symbol,
            createdAt: p.createdAt,
            customer: { email: p.customer?.email },
          }))
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card className="border-cyan-500/30 bg-black/40 backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.08)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : usersCount}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          <Card className="border-violet-500/30 bg-black/40 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.08)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : premiumCount}</div>
              <p className="text-xs text-muted-foreground">Premium and lifetime plans</p>
            </CardContent>
          </Card>
          <Card className="border-indigo-500/30 bg-black/40 backdrop-blur-xl shadow-[0_0_30px_rgba(99,102,241,0.08)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prediction Logs</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : predictionCount}</div>
              <p className="text-xs text-muted-foreground">Stored prediction outputs</p>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/30 bg-black/40 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.08)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users Today</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : activeUsersToday}</div>
              <p className="text-xs text-muted-foreground">Distinct users with prediction activity</p>
            </CardContent>
          </Card>
        </div>
        <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4" />Operations Status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Admin panel is now powered by secure backend RBAC APIs. Use the Users and Prediction Logs sections to manage accounts and AI outputs.
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Usage Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="predictionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => String(v).slice(5)} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#22d3ee" fill="url(#usersGradient)" />
                <Area type="monotone" dataKey="predictions" stroke="#8b5cf6" fill="url(#predictionsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {recentLogs.length === 0 ? (
              <p className="text-muted-foreground">No recent activity.</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log._id} className="rounded-md border border-primary/10 px-3 py-2">
                  <span className="font-medium">{log.symbol}</span> prediction by{' '}
                  <span className="text-cyan-300">{log.customer?.email || 'anonymous'}</span>{' '}
                  <span className="text-muted-foreground">at {new Date(log.createdAt).toLocaleString()}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
