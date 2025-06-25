'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export function SubscribeSection() {
  const [email, setEmail] = React.useState('');
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

    try {
      // Save email to Firebase under /subscribers/{email_address}
      // Using the email as the document ID ensures uniqueness
      await setDoc(doc(db, "subscribers", email), {
        email: email,
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
      // No need to setIsLoading(false) here if redirecting immediately, 
      // but with timeout it's good practice if further actions were possible.
      // For this case, we expect navigation, so user won't interact further.

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
          <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow text-base text-foreground placeholder:text-muted-foreground"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Button 
              type="submit" 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 shrink-0"
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
          </form>
        </div>
      </div>
    </section>
  );
}
