'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MapPin, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function SubscribeSection() {
  const [email, setEmail] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    // Basic email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
    });

    setEmail('');
    setLocation('');
    setIsLoading(false);
  };

  return (
    <section id="subscribe" className="py-16 md:py-24 bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Mail className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Join the Smart Trading Circle</h2>
          <p className="mt-4 text-lg opacity-90">
            Get instant access to exclusive predictions, tutorials, and trading strategies.
          </p>
          <form onSubmit={handleSubmit} className="mt-10 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 text-base text-foreground placeholder:text-muted-foreground"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your location"
                    className="w-full pl-10 text-base text-foreground placeholder:text-muted-foreground"
                    aria-label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="bg-background text-primary hover:bg-background/90 shrink-0 w-full sm:w-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Subscribe & Continue'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
