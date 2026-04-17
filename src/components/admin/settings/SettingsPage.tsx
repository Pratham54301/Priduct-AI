'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { adminService, type AdminSettings } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [apiUsage, setApiUsage] = React.useState<Awaited<ReturnType<typeof adminService.getApiUsage>>['data'] | null>(null);
  const [settings, setSettings] = React.useState<AdminSettings | null>(null);

  const load = React.useCallback(async () => {
    try {
      const [settingsRes, usageRes] = await Promise.all([adminService.getSettings(), adminService.getApiUsage()]);
      setSettings(settingsRes.data);
      setApiUsage(usageRes.data);
    } catch (error: any) {
      toast({ title: 'Failed to load settings', description: error.message || 'Request failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    load();
  }, [load]);

  const saveSettings = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      await adminService.updateSettings(settings);
      toast({ title: 'Settings saved', description: 'Admin control settings updated instantly.' });
      await load();
    } catch (error: any) {
      toast({ title: 'Save failed', description: error.message || 'Could not save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Admin Settings</h1>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Feature Toggle System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between rounded-md border border-primary/10 p-3">
            <span>AI Predictions</span>
            <Switch
              checked={settings.featureToggles.aiPredictionsEnabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => prev ? ({ ...prev, featureToggles: { ...prev.featureToggles, aiPredictionsEnabled: checked } }) : prev)
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-primary/10 p-3">
            <span>Premium System</span>
            <Switch
              checked={settings.featureToggles.premiumSystemEnabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => prev ? ({ ...prev, featureToggles: { ...prev.featureToggles, premiumSystemEnabled: checked } }) : prev)
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-primary/10 p-3">
            <span>Email Alerts</span>
            <Switch
              checked={settings.featureToggles.emailAlertsEnabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => prev ? ({ ...prev, featureToggles: { ...prev.featureToggles, emailAlertsEnabled: checked } }) : prev)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Market Sentiment Override</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <select
            aria-label="Sentiment mode"
            value={settings.marketSentiment.mode}
            onChange={(e) =>
              setSettings((prev) => prev ? ({ ...prev, marketSentiment: { ...prev.marketSentiment, mode: e.target.value as 'auto' | 'manual' } }) : prev)
            }
            className="h-10 rounded-md border border-primary/20 bg-black/30 px-3 text-sm"
          >
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
          </select>
          <select
            aria-label="Sentiment value"
            value={settings.marketSentiment.value}
            onChange={(e) =>
              setSettings((prev) => prev ? ({ ...prev, marketSentiment: { ...prev.marketSentiment, value: e.target.value as 'bullish' | 'bearish' | 'neutral' } }) : prev)
            }
            className="h-10 rounded-md border border-primary/20 bg-black/30 px-3 text-sm"
          >
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </select>
          <Input
            value={settings.marketSentiment.note || ''}
            onChange={(e) =>
              setSettings((prev) => prev ? ({ ...prev, marketSentiment: { ...prev.marketSentiment, note: e.target.value } }) : prev)
            }
            placeholder="Override note"
          />
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>AI Prompt Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={8}
            value={settings.aiPrompt}
            onChange={(e) => setSettings((prev) => prev ? ({ ...prev, aiPrompt: e.target.value }) : prev)}
            placeholder="Enter dynamic AI system prompt for predictions"
            className="bg-black/40"
          />
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Revenue Tracking (Future Ready)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input
            value={settings.paymentConfig.currency}
            onChange={(e) => setSettings((prev) => prev ? ({ ...prev, paymentConfig: { ...prev.paymentConfig, currency: e.target.value.toUpperCase() } }) : prev)}
            placeholder="Currency"
          />
          <Input
            type="number"
            value={settings.paymentConfig.premiumMonthlyPrice}
            onChange={(e) => setSettings((prev) => prev ? ({ ...prev, paymentConfig: { ...prev.paymentConfig, premiumMonthlyPrice: Number(e.target.value || 0) } }) : prev)}
            placeholder="Premium monthly price"
          />
          <Input
            type="number"
            value={settings.paymentConfig.lifetimePrice}
            onChange={(e) => setSettings((prev) => prev ? ({ ...prev, paymentConfig: { ...prev.paymentConfig, lifetimePrice: Number(e.target.value || 0) } }) : prev)}
            placeholder="Lifetime price"
          />
          <div className="rounded-md border border-primary/10 p-3 text-sm">
            <div className="mb-2 flex items-center justify-between">
              <span>Stripe</span>
              <Switch
                checked={settings.paymentConfig.stripeEnabled}
                onCheckedChange={(checked) => setSettings((prev) => prev ? ({ ...prev, paymentConfig: { ...prev.paymentConfig, stripeEnabled: checked } }) : prev)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Razorpay</span>
              <Switch
                checked={settings.paymentConfig.razorpayEnabled}
                onCheckedChange={(checked) => setSettings((prev) => prev ? ({ ...prev, paymentConfig: { ...prev.paymentConfig, razorpayEnabled: checked } }) : prev)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>API Control Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-primary/10 p-3">
              <p className="text-xs text-muted-foreground">Total Requests</p>
              <p className="text-xl font-semibold">{apiUsage?.counters?.totalPredictionRequests || 0}</p>
            </div>
            <div className="rounded-md border border-primary/10 p-3">
              <p className="text-xs text-muted-foreground">Gemini Usage Count</p>
              <p className="text-xl font-semibold">{apiUsage?.counters?.geminiRequestCount || 0}</p>
            </div>
            <div className="rounded-md border border-primary/10 p-3">
              <p className="text-xs text-muted-foreground">Gemini Errors</p>
              <p className="text-xl font-semibold">{apiUsage?.counters?.geminiErrorCount || 0}</p>
            </div>
          </div>
          <div className="rounded-md border border-primary/10 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span>Recent error logs</span>
              <Badge variant="secondary">{apiUsage?.recentErrors?.length || 0}</Badge>
            </div>
            {(apiUsage?.recentErrors || []).slice(0, 6).map((item) => (
              <div key={item._id} className="mb-1 text-xs text-rose-300">
                {new Date(item.createdAt).toLocaleString()} - {item.message || 'Unknown error'}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
