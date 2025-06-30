'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, ShieldCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
  role: z.enum(['User', 'Admin']),
  adminId: z.string().optional(),
  adminPassword: z.string().optional(),
}).refine(data => {
    if (data.role === 'User') {
        return !!data.email && z.string().email().safeParse(data.email).success && !!data.password && data.password.length >= 6;
    }
    return true;
}, {
    message: "Email and password are required for user login.",
    path: ['email'],
});

export function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [role, setRole] = React.useState<'User' | 'Admin'>('User');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'User',
      adminId: '',
      adminPassword: '',
    },
  });

  React.useEffect(() => {
    form.setValue('role', role);
  }, [role, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (values.role === 'Admin') {
      if (values.adminId === 'Priduct369' && values.adminPassword === 'Ai@0000') {
        toast({
          title: "Admin Login Successful!",
          description: "Redirecting to the admin panel...",
        });
        sessionStorage.setItem('isAdmin', 'true');
        router.push('/admin-panel');
      } else {
        toast({
          title: "Invalid Admin Credentials",
          description: "The Admin ID or Password is incorrect.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
      return;
    }
    
    // Simulate regular user login
    console.log(values);
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Login Successful!",
      description: "Redirecting to your dashboard...",
    });
    
    // In a real app, you would redirect the user after successful login.
    // For now, redirecting to home
    router.push('/');
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
      <CardHeader className="text-center space-y-2">
        <LogIn className="mx-auto h-8 w-8 text-primary" />
        <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-center space-x-2 pt-2">
              <Label htmlFor="role-switch" className={`transition-colors ${role === 'User' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>User</Label>
              <Switch
                id="role-switch"
                checked={role === 'Admin'}
                onCheckedChange={(checked) => setRole(checked ? 'Admin' : 'User')}
                disabled={isLoading}
              />
              <Label htmlFor="role-switch" className={`transition-colors ${role === 'Admin' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>Admin</Label>
            </div>

            {role === 'User' ? (
                <>
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <Link href="#" className="text-sm font-medium text-primary hover:underline">
                            Forgot Password?
                            </Link>
                        </div>
                        <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </>
            ) : (
                <Card className="p-4 bg-muted/50 border-primary/20 animate-in fade-in-50 duration-500">
                    <div className="space-y-4">
                    <CardDescription className="text-center flex items-center justify-center gap-2"><ShieldCheck className="h-4 w-4" /> Admin Login</CardDescription>
                    <FormField
                        control={form.control}
                        name="adminId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Admin ID</FormLabel>
                            <FormControl>
                            <Input placeholder="Enter Admin ID" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="adminPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Admin Password</FormLabel>
                            <FormControl>
                            <Input type="password" placeholder="Enter Admin Password" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
              </Card>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
