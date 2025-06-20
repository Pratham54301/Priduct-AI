import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

export function SubscribeSection() {
  return (
    <section id="subscribe" className="py-16 md:py-24 bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="h-16 w-16 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Join the Smart Trading Circle</h2>
        <p className="mt-4 text-lg opacity-90">
          Subscribe to our newsletter for exclusive insights, market updates, and a free eBook: "AI Investing Strategies for 2025".
        </p>
        <form className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="flex-grow text-base text-foreground placeholder:text-muted-foreground"
            aria-label="Email address"
          />
          <Button type="submit" size="lg" className="bg-background text-primary hover:bg-background/90 shrink-0">
            Subscribe Now
          </Button>
        </form>
        <p className="mt-4 text-xs opacity-70">
          Get a free 7-day trial of Premium features upon subscription!
        </p>
      </div>
    </section>
  );
}
