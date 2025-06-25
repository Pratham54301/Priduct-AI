'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Zap, Users, ArrowRight, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  profession: z.string().min(3, "Profession is required."),
  reason: z.string().min(10, "Please tell us a bit more.").max(500, "Please keep it under 500 characters."),
});

const benefits = [
  { icon: DollarSign, title: 'Earn With Referrals', description: 'Get competitive commissions for every new user you bring to our platform.' },
  { icon: Zap, title: 'Get Early Tools', description: 'Access our latest AI prediction models and features before anyone else.' },
  { icon: Users, title: 'Business Insights', description: 'Leverage our data to provide more value to your clients and grow your business.' },
];

const steps = [
  { title: 'Submit Application', description: 'Fill out the form with your details.' },
  { title: 'Verification', description: 'Our team will review your application.' },
  { title: 'Onboarding', description: 'Get access to your partner dashboard and resources.' },
  { title: 'Start Earning', description: 'Begin your journey of growth with PredictAI.' },
];

export function BecomePartnerPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', profession: '', reason: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Application Submitted!",
      description: "Thank you for your interest. We will get back to you within 3-5 business days.",
    });
    form.reset();
    setIsLoading(false);
  }

  return (
    <div className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">Become a Partner with PredictAI</h1>
          <p className="mt-4 text-lg text-muted-foreground">Join our ecosystem of financial experts and innovators.</p>
        </div>

        <section id="benefits" className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary">Partner Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map(benefit => (
              <Card key={benefit.title} className="text-center shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 mx-auto">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="onboarding-steps" className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-primary">Simple Onboarding Process</h2>
          <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
             {steps.map((step, index) => (
                <div key={index} className="relative z-10 flex flex-col items-center text-center w-1/4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-3 border-4 border-background">{index + 1}</div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                </div>
             ))}
          </div>
        </section>

        <section id="application-form">
          <Card className="max-w-3xl mx-auto shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Partner Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="profession" render={({ field }) => (
                    <FormItem><FormLabel>Profession / Area of Expertise</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="reason" render={({ field }) => (
                    <FormItem><FormLabel>Why do you want to partner with us?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
