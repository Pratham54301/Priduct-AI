'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/services/adminService';
import { Loader2, Crown, Gem, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function PremiumControlPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Awaited<ReturnType<typeof adminService.getPremiumAnalytics>>['data'] | null>(null);
  const [selectedUserId, setSelectedUserId] = React.useState('');
  const [plan, setPlan] = React.useState<'free' | 'premium' | 'lifetime'>('premium');
  const [expiresAt, setExpiresAt] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      const result = await adminService.getPremiumAnalytics();
      setData(result.data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (!selectedUserId) {
      toast({ title: 'Select a user', description: 'Choose a premium user to modify.', variant: 'destructive' });
      return;
    }
    try {
      setIsSaving(true);
      await adminService.upsertSubscription(selectedUserId, plan, expiresAt || undefined);
      toast({ title: 'Subscription updated', description: 'Premium subscription settings saved.' });
      await load();
    } catch (error: any) {
      toast({ title: 'Update failed', description: error.message || 'Could not update subscription', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl">Premium Control Center</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
          <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Users className="h-4 w-4" />Total Users</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{data?.totalUsers ?? 0}</p></CardContent>
        </Card>
        <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
          <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Crown className="h-4 w-4" />Premium Users</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{data?.premiumUsers ?? 0}</p></CardContent>
        </Card>
        <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
          <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Gem className="h-4 w-4" />Lifetime Users</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{data?.lifetimeUsers ?? 0}</p></CardContent>
        </Card>
        <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
          <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Sparkles className="h-4 w-4" />Conversion</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{data?.conversionRate ?? 0}%</p></CardContent>
        </Card>
        <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
          <CardHeader><CardTitle className="text-sm">Revenue (estimated)</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{data?.paymentIntegration?.currency || 'INR'} {data?.totalEarnings ?? 0}</p></CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Premium Subscription Control</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <select
            aria-label="Select user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="h-10 rounded-md border border-primary/20 bg-black/30 px-3 text-sm"
          >
            <option value="">Select user</option>
            {(data?.premiumUsersList || []).map((u) => (
              <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
            ))}
          </select>
          <select
            aria-label="Select subscription plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value as 'free' | 'premium' | 'lifetime')}
            className="h-10 rounded-md border border-primary/20 bg-black/30 px-3 text-sm"
          >
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            <option value="lifetime">Lifetime</option>
          </select>
          <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Update Subscription'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Premium Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {data?.premiumUsersList?.length ? (
            data.premiumUsersList.map((user) => (
              <div key={user.id} className="rounded-md border border-primary/10 p-3">
                <span className="font-medium">{user.fullName}</span>{' '}
                <span className="text-cyan-300">({user.email})</span>{' '}
                <span className="text-muted-foreground">- {user.membership} - {user.isActive ? 'active' : 'inactive'}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No recent subscription activity found.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
