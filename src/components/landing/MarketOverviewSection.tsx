
'use client';

import * as React from 'react';
import { MarketCard } from './MarketCard';
import { AreaChart, Bitcoin, Gem, Droplet, Landmark, Sigma, Flame, Briefcase, ArrowRightLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialMarketData = [
  // Indian Stocks
  { name: 'Nifty 50', value: '23,501.10', change: '+183.45 (0.79%)', changeType: 'positive' as const, marketType: 'Stock', icon: AreaChart },
  { name: 'Sensex', value: '77,209.90', change: '+620.73 (0.80%)', changeType: 'positive' as const, marketType: 'Stock', icon: AreaChart },
  { name: 'Reliance', value: '₹2,908.45', change: '-15.20 (0.52%)', changeType: 'negative' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'TCS', value: '₹3,814.90', change: '+21.80 (0.57%)', changeType: 'positive' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'HDFC Bank', value: '₹1,710.80', change: '+12.10 (0.71%)', changeType: 'positive' as const, marketType: 'Stock', icon: Landmark },
  { name: 'Infosys', value: '₹1,525.50', change: '+10.10 (0.66%)', changeType: 'positive' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'ICICI Bank', value: '₹1,125.40', change: '-5.80 (0.51%)', changeType: 'negative' as const, marketType: 'Stock', icon: Landmark },
  { name: 'Zomato', value: '₹190.50', change: '+2.15 (1.14%)', changeType: 'positive' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'Adani Ports', value: '₹1,450.70', change: '-25.10 (1.70%)', changeType: 'negative' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'SBI', value: '₹836.25', change: '+5.50 (0.66%)', changeType: 'positive' as const, marketType: 'Stock', icon: Landmark },
  { name: 'L&T', value: '₹3,580.00', change: '+40.30 (1.14%)', changeType: 'positive' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'Axis Bank', value: '₹1,225.00', change: '-8.00 (0.65%)', changeType: 'negative' as const, marketType: 'Stock', icon: Landmark },
  
  // US Stocks
  { name: 'Apple (AAPL)', value: '$214.29', change: '-2.19 (1.01%)', changeType: 'negative' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'Tesla (TSLA)', value: '$183.01', change: '+1.86 (1.03%)', changeType: 'positive' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'Google (GOOGL)', value: '$180.79', change: '+1.53 (0.85%)', changeType: 'positive' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'Nvidia (NVDA)', value: '$126.57', change: '-4.32 (3.30%)', changeType: 'negative' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'Amazon (AMZN)', value: '$185.57', change: '-3.54 (1.87%)', changeType: 'negative' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'Meta (META)', value: '$505.50', change: '+8.10 (1.63%)', changeType: 'positive' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'Netflix (NFLX)', value: '$669.02', change: '-17.80 (2.59%)', changeType: 'negative' as const, marketType: 'Stock', icon: Briefcase },
  { name: 'J&J (JNJ)', value: '$146.50', change: '+0.25 (0.17%)', changeType: 'positive' as const, marketType: 'Stock', icon: Briefcase },

  // Cryptocurrencies
  { name: 'Bitcoin (BTC)', value: '$65,123.45', change: '-500.12 (0.76%)', changeType: 'negative' as const, marketType: 'Crypto', icon: Bitcoin },
  { name: 'Ethereum (ETH)', value: '$3,518.60', change: '+25.41 (0.73%)', changeType: 'positive' as const, marketType: 'Crypto', icon: Gem },
  { name: 'Solana (SOL)', value: '$136.50', change: '-2.10 (1.51%)', changeType: 'negative' as const, marketType: 'Crypto', icon: Bitcoin },
  { name: 'Dogecoin (DOGE)', value: '$0.123', change: '+0.005 (4.21%)', changeType: 'positive' as const, marketType: 'Crypto', icon: Bitcoin },
  { name: 'XRP', value: '$0.475', change: '-0.012 (2.46%)', changeType: 'negative' as const, marketType: 'Crypto', icon: Bitcoin },
  { name: 'Cardano (ADA)', value: '$0.38', change: '+0.01 (2.70%)', changeType: 'positive' as const, marketType: 'Crypto', icon: Bitcoin },
  { name: 'BNB', value: '$585.20', change: '-10.50 (1.76%)', changeType: 'negative' as const, marketType: 'Crypto', icon: Bitcoin },

  // Currencies
  { name: 'USD/INR', value: '₹83.55', change: '+0.02 (0.02%)', changeType: 'positive' as const, marketType: 'Currency', icon: Landmark },
  { name: 'EUR/USD', value: '$1.0715', change: '-0.0010 (0.09%)', changeType: 'negative' as const, marketType: 'Currency', icon: ArrowRightLeft },
  { name: 'GBP/JPY', value: '¥201.23', change: '-0.15 (0.07%)', changeType: 'negative' as const, marketType: 'Currency', icon: ArrowRightLeft },
  { name: 'AUD/USD', value: '$0.6650', change: '-0.0015 (0.22%)', changeType: 'negative' as const, marketType: 'Currency', icon: ArrowRightLeft },
  { name: 'GBP/INR', value: '₹106.10', change: '+0.05 (0.05%)', changeType: 'positive' as const, marketType: 'Currency', icon: Landmark },
  
  // Commodities
  { name: 'Gold (XAU)', value: '$2,320.50', change: '+5.20 (0.22%)', changeType: 'positive' as const, marketType: 'Commodity', icon: Gem },
  { name: 'Silver (XAG)', value: '$29.50', change: '+0.15 (0.51%)', changeType: 'positive' as const, marketType: 'Commodity', icon: Sigma },
  { name: 'Crude Oil (WTI)', value: '$80.15', change: '-0.58 (0.72%)', changeType: 'negative' as const, marketType: 'Commodity', icon: Droplet },
  { name: 'Natural Gas', value: '$2.85', change: '+0.03 (1.06%)', changeType: 'positive' as const, marketType: 'Commodity', icon: Flame },
];

const categories = ['All', 'Stock', 'Crypto', 'Currency', 'Commodity'];

export function MarketOverviewSection() {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [marketData, setMarketData] = React.useState(initialMarketData);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(currentData =>
        currentData.map(item => {
          // 20% chance to update each item to simulate live data
          if (Math.random() < 0.2) {
            const valueNum = parseFloat(item.value.replace(/[^0-9.]/g, ''));
            const randomFactor = (Math.random() - 0.5) * 0.02; // larger fluctuation
            const newValue = valueNum * (1 + randomFactor);
            
            const changeMatch = item.change.match(/([+-][\d,]+\.?\d*)\s\((.*)\)/);
            if (!changeMatch) return item;

            const changeAmount = parseFloat(changeMatch[1].replace(/,/g, ''));
            const newChangeAmount = changeAmount + (newValue - valueNum);
            const newChangePercent = (newChangeAmount / (newValue - newChangeAmount)) * 100;

            const valuePrefix = item.value.startsWith('₹') ? '₹' : item.value.startsWith('$') ? '$' : item.value.startsWith('¥') ? '¥' : '';

            return {
              ...item,
              value: `${valuePrefix}${(item.marketType === 'Currency' ? newValue.toFixed(4) : newValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}`,
              change: `${newChangeAmount >= 0 ? '+' : ''}${newChangeAmount.toFixed(2)} (${newChangePercent.toFixed(2)}%)`,
              changeType: newChangeAmount >= 0 ? 'positive' : 'negative',
            };
          }
          return item;
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);


  const filteredAssets = React.useMemo(() => {
    if (activeCategory === 'All') return marketData;
    return marketData.filter(item => item.marketType === activeCategory);
  }, [activeCategory, marketData]);

  return (
    <section id="features" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Live Market Snapshots</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real-time data from global markets at your fingertips.
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full max-w-lg mx-auto">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
             {categories.map((category) => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
             ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="mt-8 w-full overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,white_2%,white_98%,transparent)]">
        <div className="flex w-max animate-marquee-slow hover:[animation-play-state:paused]">
          {filteredAssets.length > 0 && [...filteredAssets, ...filteredAssets].map((item, index) => (
            <div key={`${item.name}-${index}`} className="px-2">
              <MarketCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
