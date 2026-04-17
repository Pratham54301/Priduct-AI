'use client';

import * as React from 'react';
import { Loader2, Search, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { adminService, type AdminPrediction } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function PredictionLogsPage() {
  const { toast } = useToast();
  const [logs, setLogs] = React.useState<AdminPrediction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [date, setDate] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [user, setUser] = React.useState('');

  React.useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ page: '1', limit: '100' });
        if (query.trim()) params.set('q', query.trim());
        if (date) params.set('date', date);
        if (symbol.trim()) params.set('symbol', symbol.trim().toUpperCase());
        if (user.trim()) params.set('user', user.trim());
        const result = await adminService.getPredictionLogs(params);
        setLogs(result.data);
      } catch (error: any) {
        toast({
          title: 'Failed to load prediction logs',
          description: error.message || 'Could not fetch prediction logs.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [toast, query, date, symbol, user]);

  const handleDeletePrediction = async (id: string) => {
    const ok = window.confirm('Delete this prediction log?');
    if (!ok) return;
    try {
      await adminService.deletePrediction(id);
      setLogs((prev) => prev.filter((log) => log._id !== id));
      toast({ title: 'Prediction deleted', description: 'Prediction log removed successfully.' });
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message || 'Could not delete prediction log.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold md:text-2xl">Prediction Logs</h1>
        <div className="flex w-full max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by symbol or user..."
              className="pl-8"
            />
          </div>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-[180px]" />
          <Input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Symbol"
            className="w-[120px]"
          />
          <Input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="User email/name"
            className="w-[160px]"
          />
          <Button variant="outline" onClick={() => { setDate(''); setQuery(''); setSymbol(''); setUser(''); }}>Reset</Button>
        </div>
      </div>
      <Card className="border-primary/20 bg-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>AI Prediction Outputs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                  <TableHead>Prediction Result</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>User</TableHead>
                  <TableHead>Date/Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">No prediction logs found.</TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{log.symbol} ({log.exchange})</TableCell>
                    <TableCell>{log.market_sentiment || 'neutral'}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'ok' ? 'default' : 'secondary'}>{log.status}</Badge>
                    </TableCell>
                    <TableCell>{log.current_price}</TableCell>
                    <TableCell>{log.confidence ?? '-'}</TableCell>
                    <TableCell>{log.customer?.email || 'anonymous'}</TableCell>
                    <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="destructive" onClick={() => handleDeletePrediction(log._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
