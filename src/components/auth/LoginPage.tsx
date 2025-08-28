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
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
  role: z.enum(['User', 'Admin']),
  email: z.string().optional(),
  password: z.string().optional(),
  adminId: z.string().optional(),
  adminPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === 'User') {
    if (!data.email || !z.string().email().safeParse(data.email).success) {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "A valid email is required.", path: ['email'] });
    }
    if (!data.password || data.password.length === 0) {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password is required.", path: ['password'] });
    }
  } else if (data.role === 'Admin') {
    if (!data.adminId || data.adminId.trim() === '') {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Admin ID is required.", path: ['adminId'] });
    }
    if (!data.adminPassword || data.adminPassword.trim() === '') {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Admin Password is required.", path: ['adminPassword'] });
    }
  }
});

export function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { login, user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [role, setRole] = React.useState<'User' | 'Admin'>('User');

  React.useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

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
    form.clearErrors();
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
        router.push('/admin');
      } else {
        toast({
          title: "Invalid Admin Credentials",
          description: "The Admin ID or Password is incorrect.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
      return;
    }
    
    // Regular user login with custom backend API
    try {
        if (!values.email || !values.password) throw new Error("Email and password are required.");
        
        const result = await login(values.email, values.password);
        
        if (result.success) {
            toast({
                title: "Login Successful!",
                description: "Welcome back! Redirecting you now...",
            });
            
            // Always redirect to home after login
            router.push('/');
        } else {
            throw new Error(result.message);
        }
    } catch (error: any) {
        let title = "Login Failed";
        let description = "An unexpected error occurred. Please try again.";

        if (error.message === "Invalid credentials") {
            title = "Invalid Credentials";
            description = "The email or password you entered is incorrect.";
        } else if (error.message === "User not found") {
            title = "User Not Found";
            description = "No account found with this email address.";
        }

        toast({
            title,
            description,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
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
                <div className="space-y-4 animate-in fade-in-50 duration-500">
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
                </div>
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
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {role === 'Admin' ? 'Verifying...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {role === 'Admin' ? (
                    <ShieldCheck className="mr-2 h-4 w-4" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  {role === 'Admin' ? 'Admin Login' : 'Sign In'}
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
