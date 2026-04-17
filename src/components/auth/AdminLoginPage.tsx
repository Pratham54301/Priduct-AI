"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield } from 'lucide-react';

export function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        toast({
          title: 'Admin login failed',
          description: result.message || 'Invalid credentials.',
          variant: 'destructive',
        });
        return;
      }

      const target = result.redirectTo || '/dashboard';
      if (target !== '/admin' && target !== '/admin/dashboard') {
        toast({
          title: 'Access denied',
          description: 'This account is not an admin account.',
          variant: 'destructive',
        });
        router.push('/');
        return;
      }

      toast({
        title: 'Admin login successful',
        description: 'Redirecting to admin dashboard...',
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({
        title: 'Admin login failed',
        description: error?.message || 'Unexpected error. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Login
        </CardTitle>
        <CardDescription className="text-center">
          Sign in with an admin account to access the admin dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="admin-email">Email</label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="admin-password">Password</label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in as Admin'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
