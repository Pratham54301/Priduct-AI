'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, ShieldCheck } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['User', 'Admin']),
  adminId: z.string().optional(),
  adminPassword: z.string().optional(),
});

export function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [role, setRole] = React.useState<'User' | 'Admin'>('User');

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
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

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);

    if (values.role === 'Admin') {
      // Hardcoded admin credentials check
      if (values.adminId === 'Priduct369' && values.adminPassword === 'Ai@0000') {
        toast({
          title: "Admin Validation Successful!",
          description: "Redirecting to the admin panel...",
        });
        // In a real app, you would issue a secure session/token here.
        // For this prototype, we'll use sessionStorage. THIS IS NOT SECURE.
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

    // Simulate regular user signup
    console.log("Simulating sign up for:", values);
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Account Created Successfully!",
      description: "You have been signed up. Redirecting to home...",
    });

    setTimeout(() => {
      router.push('/');
    }, 1500);
  }

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
      <CardHeader className="text-center space-y-2">
        <UserPlus className="mx-auto h-8 w-8 text-primary" />
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>Join PredictAI to get started with AI-powered insights</CardDescription>
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

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {role === 'Admin' && (
              <Card className="p-4 bg-muted/50 border-primary/20 animate-in fade-in-50 duration-500">
                <div className="space-y-4">
                   <CardDescription className="text-center flex items-center justify-center gap-2"><ShieldCheck className="h-4 w-4" /> Admin Validation Required</CardDescription>
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
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Processing...' : 'Create Account'}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
