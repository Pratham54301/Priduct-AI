
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AdData {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl: string;
  imageHint: string;
}

const adsData: AdData[] = [
  { id: 'ad1', imageUrl: 'https://placehold.co/728x200.png', altText: 'Advertisement 1: Discover New Investments', linkUrl: '#', imageHint: 'investment chart' },
  { id: 'ad2', imageUrl: 'https://placehold.co/728x200.png', altText: 'Advertisement 2: Tech Stocks Outlook', linkUrl: '#', imageHint: 'tech analysis' },
  { id: 'ad3', imageUrl: 'https://placehold.co/728x200.png', altText: 'Advertisement 3: Join Our Webinar', linkUrl: '#', imageHint: 'online webinar' },
  { id: 'ad4', imageUrl: 'https://placehold.co/728x200.png', altText: 'Advertisement 4: Secure Trading Platform', linkUrl: '#', imageHint: 'security shield' },
];

const AdUnit: React.FC<{ ad: AdData }> = ({ ad }) => {
  if (!ad) return null;
  return (
    <a
      href={ad.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative group w-full h-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded-lg"
      aria-label={ad.altText}
    >
      <Card className="w-full h-full p-0 bg-card shadow-md overflow-hidden group-hover:shadow-xl group-hover:ring-2 group-hover:ring-accent transition-all duration-300">
        <Image
          src={ad.imageUrl}
          alt={ad.altText}
          fill
          className="object-cover"
          data-ai-hint={ad.imageHint}
          sizes="(max-width: 768px) 100vw, 728px"
        />
        <span className="absolute top-2 left-2 text-xs bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded shadow">
          Ad
        </span>
      </Card>
    </a>
  );
};

export function AdvertisingBannerSection() {
  const [currentTick, setCurrentTick] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const setupInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setCurrentTick(prevTick => prevTick + 1);
      }, 10000); // Rotate every 10 seconds
    };

    if (isHovering) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      setupInterval();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering]);

  // Desktop ads: pair changes every 10s
  const desktopPairIndex = currentTick % 2; // 0 or 1
  const desktopAd1 = adsData[desktopPairIndex * 2];
  const desktopAd2 = adsData[desktopPairIndex * 2 + 1];

  // Mobile ad: changes every 10s, cycling through all 4
  const mobileAdIndex = currentTick % adsData.length; // 0, 1, 2, 3
  const mobileAd = adsData[mobileAdIndex];

  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop View: 2 ads side-by-side */}
        <div
          className="hidden md:flex justify-center items-center gap-8"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-[728px] h-[200px]">
            {desktopAd1 && <AdUnit ad={desktopAd1} />}
          </div>
          <div className="w-[728px] h-[200px]">
            {desktopAd2 && <AdUnit ad={desktopAd2} />}
          </div>
        </div>

        {/* Mobile View: 1 ad */}
        <div
          className="md:hidden flex justify-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-full max-w-[728px] aspect-[728/200]">
             {mobileAd && <AdUnit ad={mobileAd} />}
          </div>
        </div>
      </div>
    </section>
  );
}
