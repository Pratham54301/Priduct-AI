'use client';

import * as React from 'react';
import Link from 'next/link';
<<<<<<< Updated upstream
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
=======
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
>>>>>>> Stashed changes
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, ShieldCheck } from 'lucide-react';
<<<<<<< Updated upstream
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addUser } from '@/services/userService';
=======
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
>>>>>>> Stashed changes

const signUpSchema = z.object({
  role: z.enum(['User', 'Admin']),
  fullName: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
<<<<<<< Updated upstream
=======
  confirmPassword: z.string().optional(),
>>>>>>> Stashed changes
  adminId: z.string().optional(),
  adminPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === 'User') {
<<<<<<< Updated upstream
    if (!data.fullName || data.fullName.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Full name must be at least 2 characters.", path: ['fullName'] });
    }
    const emailValidation = z.string().email().safeParse(data.email);
    if (!data.email || !emailValidation.success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid email address.", path: ['email'] });
=======
    if (!data.fullName || data.fullName.trim() === '') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Full name is required.", path: ['fullName'] });
    }
    if (!data.email || !z.string().email().safeParse(data.email).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "A valid email is required.", path: ['email'] });
>>>>>>> Stashed changes
    }
    if (!data.password || data.password.length < 6) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password must be at least 6 characters.", path: ['password'] });
    }
<<<<<<< Updated upstream
  } else if (data.role === 'Admin') {
    if (!data.adminId || data.adminId.trim() === '') {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Admin ID is required.", path: ['adminId'] });
    }
    if (!data.adminPassword || data.adminPassword.trim() === '') {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Admin Password is required.", path: ['adminPassword'] });
=======
    if (!data.confirmPassword || data.confirmPassword !== data.password) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Passwords do not match.", path: ['confirmPassword'] });
    }
  } else if (data.role === 'Admin') {
    if (!data.adminId || data.adminId.trim() === '') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Admin ID is required.", path: ['adminId'] });
    }
    if (!data.adminPassword || data.adminPassword.trim() === '') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Admin Password is required.", path: ['adminPassword'] });
>>>>>>> Stashed changes
    }
  }
});

<<<<<<< Updated upstream

export function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
=======
export function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { register } = useAuth();
>>>>>>> Stashed changes
  const [isLoading, setIsLoading] = React.useState(false);
  const [role, setRole] = React.useState<'User' | 'Admin'>('User');

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
<<<<<<< Updated upstream
=======
      confirmPassword: '',
>>>>>>> Stashed changes
      role: 'User',
      adminId: '',
      adminPassword: '',
    },
  });
  
  React.useEffect(() => {
    form.setValue('role', role);
    form.clearErrors();
  }, [role, form]);

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);

    if (values.role === 'Admin') {
      if (values.adminId === 'Priduct369' && values.adminPassword === 'Ai@0000') {
        toast({
          title: "Admin Validation Successful!",
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

<<<<<<< Updated upstream
    // Regular user signup with Firebase
    try {
        if (!auth) throw new Error("Firebase Auth is not configured.");
        if (!values.email || !values.password || !values.fullName) throw new Error("Full name, email and password are required.");
        
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        // Add user to Firestore database
        await addUser({
            fullName: values.fullName,
            email: user.email!,
            role: 'User',
            status: 'Active',
            joined: new Date().toISOString()
        });

        toast({
            title: "Account Created Successfully!",
            description: "Welcome! Redirecting you to the home page...",
        });
        router.push('/');
    } catch (error: any) {
        let title = "Sign Up Failed";
        let description = "An unexpected error occurred. Please try again.";
        
        if (error.code === 'auth/email-already-in-use') {
            title = "Email Already Registered";
            description = "An account with this email address already exists. Please try logging in instead.";
        }
        
        toast({
            title,
            description,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
=======
    // Regular user registration
    if (values.fullName && values.email && values.password) {
      const result = await register(values.fullName, values.email, values.password);
      
      if (result.success) {
        toast({
          title: "Account Created Successfully!",
          description: "Redirecting to home...",
        });
        router.push('/');
      } else {
        toast({
          title: "Registration Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    }
    
    setIsLoading(false);
>>>>>>> Stashed changes
  }

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
<<<<<<< Updated upstream
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

            {role === 'User' ? (
              <div className="space-y-4 animate-in fade-in-50 duration-500">
=======
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="role-toggle"
                checked={role === 'Admin'}
                onCheckedChange={(checked) => setRole(checked ? 'Admin' : 'User')}
              />
              <Label htmlFor="role-toggle" className="text-sm font-medium">
                {role === 'Admin' ? 'Admin Registration' : 'User Registration'}
              </Label>
            </div>

            {role === 'User' ? (
              <>
>>>>>>> Stashed changes
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
<<<<<<< Updated upstream
                        <Input placeholder="John Doe" {...field} disabled={isLoading} />
=======
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                        />
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
=======
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        />
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                        <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
=======
                        <Input
                          placeholder="Create a password"
                          type="password"
                          {...field}
                        />
>>>>>>> Stashed changes
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
<<<<<<< Updated upstream
              </div>
            ) : (
              <Card className="p-4 bg-muted/50 border-primary/20 animate-in fade-in-50 duration-500">
                  <div className="space-y-4">
                      <CardDescription className="text-center flex items-center justify-center gap-2"><ShieldCheck className="h-4 w-4" /> Admin Access</CardDescription>
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
=======
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm your password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="adminId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter admin ID"
                          {...field}
                        />
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
                        <Input
                          placeholder="Enter admin password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
>>>>>>> Stashed changes
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
<<<<<<< Updated upstream
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Processing...' : (role === 'Admin' ? 'Validate & Continue' : 'Create Account')}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
=======
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {role === 'Admin' ? 'Verifying...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {role === 'Admin' ? (
                    <ShieldCheck className="mr-2 h-4 w-4" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  {role === 'Admin' ? 'Admin Registration' : 'Create Account'}
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary hover:underline">
>>>>>>> Stashed changes
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
