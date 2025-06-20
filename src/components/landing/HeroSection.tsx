
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32 bg-gradient-to-br from-background to-card overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
         <Image 
            src="https://placehold.co/1920x1080.png" 
            alt="Abstract data stream background" 
            fill
            className="object-cover"
            data-ai-hint="data stream network"
            priority
          />
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline">
          <span className="block text-foreground">Predict Tomorrow's Markets</span>
          <span className="block text-primary">Today with AI-Powered Precision</span>
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl">
          Transform your investment strategy with cutting-edge predictions powered by real-time data, technical indicators, and global market intelligence.
        </p>
        <div className="mt-10">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-lg" asChild>
            <a href="#subscribe">
              Start Predicting Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
