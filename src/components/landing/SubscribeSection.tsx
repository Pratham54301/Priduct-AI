'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MapPin, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export function SubscribeSection() {
  const [email, setEmail] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const isFirebaseActive = !!db;

  const validateEmail = (email: string) => {
    // Basic email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!isFirebaseActive || !db) {
      toast({
        title: "Subscription Unavailable",
        description: "Firebase is not configured. Please add your credentials.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Save email and location to Firebase under /subscribers/{email_address}
      await setDoc(doc(db, "subscribers", email), {
        email: email,
        location: location,
        subscribedAt: serverTimestamp(),
      });

      toast({
        title: "Subscription successful",
        description: "Redirecting to your profile...",
      });

      // Redirect after a short delay to allow toast to be seen
      setTimeout(() => {
        window.location.href = "https://studio--predictai-7jivd.us-central1.hosted.app/profile";
      }, 1500); 

    } catch (error) {
      console.error("Subscription failed:", error);
      let errorMessage = "An error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Subscription Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
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
          {!isFirebaseActive && (
            <div className="mt-6 max-w-2xl mx-auto rounded-md bg-yellow-500/20 p-3 text-sm text-yellow-200">
              <p><strong>Subscription feature is currently disabled.</strong> The app is not configured for Firebase.</p>
            </div>
          )}
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
                    disabled={isLoading || !isFirebaseActive}
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
                    disabled={isLoading || !isFirebaseActive}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="bg-background text-primary hover:bg-background/90 shrink-0 w-full sm:w-auto"
                disabled={isLoading || !isFirebaseActive}
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
