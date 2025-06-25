
'use client';

import * as React from 'react';
import { MarketCard } from './MarketCard';
import { AreaChart, Bitcoin, Gem, Droplet, Landmark, Sigma, Flame, Briefcase, ArrowRightLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const marketData = [
  { name: 'Nifty 50', value: '23,501.10', change: '+183.45 (0.79%)', changeType: 'positive' as const, marketType: 'Stock', icon: AreaChart },
  { name: 'Sensex', value: '77,209.90', change: '+620.73 (0.80%)', changeType: 'positive' as const, marketType: 'Stock', icon: AreaChart },
  { name: 'Apple (AAPL)', value: '$214.29', change: '-2.19 (1.01%)', changeType: 'negative' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'Tesla (TSLA)', value: '$183.01', change: '+1.86 (1.03%)', changeType: 'positive' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'Bitcoin (BTC)', value: '$65,123.45', change: '-$500.12 (0.76%)', changeType: 'negative' as const, marketType: 'Crypto', icon: Bitcoin },
  { name: 'Ethereum (ETH)', value: '$3,518.60', change: '+$25.41 (0.73%)', changeType: 'positive' as const, marketType: 'Crypto', icon: Gem },
  { name: 'Reliance (RELI)', value: '₹2,908.45', change: '-₹15.20 (0.52%)', changeType: 'negative' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'Silver', value: '$29.50', change: '+$0.15 (0.51%)', changeType: 'positive' as const, marketType: 'Commodity', icon: Sigma },
  { name: 'Gold (XAU)', value: '$2,320.50', change: '+$5.20 (0.22%)', changeType: 'positive' as const, marketType: 'Commodity', icon: Gem },
  { name: 'USD/INR', value: '₹83.55', change: '+₹0.02 (0.02%)', changeType: 'positive' as const, marketType: 'Currency', icon: Landmark },
  { name: 'Crude Oil (WTI)', value: '$80.15', change: '-$0.58 (0.72%)', changeType: 'negative' as const, marketType: 'Commodity', icon: Droplet },
  { name: 'Nasdaq', value: '17,857.02', change: '-32.23 (0.18%)', changeType: 'negative' as const, marketType: 'Stock', icon: AreaChart },
  { name: 'Solana (SOL)', value: '$136.50', change: '-$2.10 (1.51%)', changeType: 'negative' as const, marketType: 'Crypto', icon: Bitcoin },
  { name: 'EUR/USD', value: '$1.0715', change: '-$0.0010 (0.09%)', changeType: 'negative' as const, marketType: 'Currency', icon: Landmark },
  { name: 'Natural Gas', value: '$2.85', change: '+0.03 (1.06%)', changeType: 'positive' as const, marketType: 'Commodity', icon: Flame },
  { name: 'TCS (TCS)', value: '₹3,814.90', change: '+₹21.80 (0.57%)', changeType: 'positive' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'GBP/JPY', value: '¥201.23', change: '-¥0.15 (0.07%)', changeType: 'negative' as const, marketType: 'Currency', icon: ArrowRightLeft },
  { name: 'S&P 500', value: '5,473.62', change: '+1.39 (0.03%)', changeType: 'positive' as const, marketType: 'Stock', icon: AreaChart },
  { name: 'Infosys (INFY)', value: '₹1,525.50', change: '+₹10.10 (0.66%)', changeType: 'positive', marketType: 'Stock', icon: Briefcase },
  { name: 'XRP (XRP)', value: '$0.475', change: '-$0.012 (2.46%)', changeType: 'negative', marketType: 'Crypto', icon: Bitcoin },
  { name: 'AUD/USD', value: '$0.6650', change: '-$0.0015 (0.22%)', changeType: 'negative', marketType: 'Currency', icon: Landmark },
  { name: 'Corn', value: '$435.25', change: '-$2.50 (0.57%)', changeType: 'negative', marketType: 'Commodity', icon: Flame },
];

const categories = ['All', 'Stock', 'Crypto', 'Currency', 'Commodity'];

export function MarketOverviewSection() {
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredAssets = React.useMemo(() => {
    if (activeCategory === 'All') return marketData;
    return marketData.filter(item => item.marketType === activeCategory);
  }, [activeCategory]);
  
  // Adjust animation duration based on the number of items to maintain a consistent speed
  const animationDuration = filteredAssets.length * 4; // 4s per item

  return (
    <section id="features" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Live Market Snapshots</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real-time data from global markets at your fingertips.
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
             {categories.map((category) => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
             ))}
          </TabsList>
        </Tabs>
        
        <div className="mt-8 h-[600px] w-full max-w-4xl mx-auto overflow-hidden relative [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]">
          <div className="flex flex-col gap-4 hover:[animation-play-state:paused]" style={{ animation: `marquee-v ${animationDuration}s linear infinite` }}>
            {/* Render list twice for a seamless loop */}
            {filteredAssets.map((item, index) => (
              <MarketCard
                key={`${item.name}-${index}-a`}
                name={item.name}
                value={item.value}
                change={item.change}
                changeType={item.changeType}
                marketType={item.marketType}
                icon={item.icon}
              />
            ))}
            {filteredAssets.map((item, index) => (
              <MarketCard
                key={`${item.name}-${index}-b`}
                name={item.name}
                value={item.value}
                change={item.change}
                changeType={item.changeType}
                marketType={item.marketType}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
