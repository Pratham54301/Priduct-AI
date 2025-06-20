import Image from 'next/image';
import { Card } from '@/components/ui/card';

export function AdvertisingBannerSection() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-4 shadow-md">
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
              <Image 
                src="https://placehold.co/728x90.png" 
                alt="Advertisement 1" 
                layout="fill"
                objectFit="contain"
                data-ai-hint="advertisement banner"
              />
              <span className="absolute top-2 left-2 text-xs bg-background/70 px-2 py-1 rounded text-muted-foreground">Ad</span>
            </div>
          </Card>
          <Card className="p-4 shadow-md">
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
              <Image 
                src="https://placehold.co/728x90.png" 
                alt="Advertisement 2" 
                layout="fill"
                objectFit="contain"
                data-ai-hint="sponsored content"
              />
              <span className="absolute top-2 left-2 text-xs bg-background/70 px-2 py-1 rounded text-muted-foreground">Ad</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
