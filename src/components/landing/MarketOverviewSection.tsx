+
'use client';

import * as React from 'react';
import { MarketCard } from './MarketCard';
import { AreaChart, Bitcoin, Gem, Droplet, Landmark, Sigma, Flame, Briefcase, ArrowRightLeft, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';

const initialMarketData = [
  // Indian Stocks
  { name: 'Nifty 50', value: '23,501.10', change: '+183.45 (0.79%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: AreaChart },
  { name: 'Sensex', value: '77,209.90', change: '+620.73 (0.80%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: AreaChart },
  { name: 'Reliance', value: '₹2,908.45', change: '-15.20 (0.52%)', changeType: 'negative' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'TCS', value: '₹3,814.90', change: '+21.80 (0.57%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'HDFC Bank', value: '₹1,710.80', change: '+12.10 (0.71%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Landmark },
  { name: 'Infosys', value: '₹1,525.50', change: '+10.10 (0.66%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'ICICI Bank', value: '₹1,125.40', change: '-5.80 (0.51%)', changeType: 'negative' as const, marketType: 'Stock' as const, icon: Landmark },
  { name: 'Zomato', value: '₹190.50', change: '+2.15 (1.14%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'Adani Ports', value: '₹1,450.70', change: '-25.10 (1.70%)', changeType: 'negative' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'SBI', value: '₹836.25', change: '+5.50 (0.66%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Landmark },
  { name: 'L&T', value: '₹3,580.00', change: '+40.30 (1.14%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'Axis Bank', value: '₹1,225.00', change: '-8.00 (0.65%)', changeType: 'negative' as const, marketType: 'Stock' as const, icon: Landmark },
  
  // US Stocks
  { name: 'Apple (AAPL)', value: '$214.29', change: '-2.19 (1.01%)', changeType: 'negative' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'Tesla (TSLA)', value: '$183.01', change: '+1.86 (1.03%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'Google (GOOGL)', value: '$180.79', change: '+1.53 (0.85%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'Nvidia (NVDA)', value: '$126.57', change: '-4.32 (3.30%)', changeType: 'negative' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'Amazon (AMZN)', value: '$185.57', change: '-3.54 (1.87%)', changeType: 'negative' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'Meta (META)', value: '$505.50', change: '+8.10 (1.63%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'Netflix (NFLX)', value: '$669.02', change: '-17.80 (2.59%)', changeType: 'negative' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'J&J (JNJ)', value: '$146.50', change: '+0.25 (0.17%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'Microsoft (MSFT)', value: '$447.67', change: '+2.10 (0.47%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Briefcase },
  { name: 'JPMorgan (JPM)', value: '$198.88', change: '-1.50 (0.75%)', changeType: 'negative' as const, marketType: 'Stock' as const, icon: Landmark },
  { name: 'Walmart (WMT)', value: '$67.80', change: '+0.10 (0.15%)', changeType: 'positive' as const, marketType: 'Stock' as const, icon: Briefcase },

  // Cryptocurrencies
  { name: 'Bitcoin (BTC)', value: '$65,123.45', change: '-500.12 (0.76%)', changeType: 'negative' as const, marketType: 'Crypto' as const, icon: Bitcoin },
  { name: 'Ethereum (ETH)', value: '$3,518.60', change: '+25.41 (0.73%)', changeType: 'positive' as const, marketType: 'Crypto' as const, icon: Gem },
  { name: 'Solana (SOL)', value: '$136.50', change: '-2.10 (1.51%)', changeType: 'negative' as const, marketType: 'Crypto' as const, icon: Bitcoin },
  { name: 'Dogecoin (DOGE)', value: '$0.123', change: '+0.005 (4.21%)', changeType: 'positive' as const, marketType: 'Crypto' as const, icon: Bitcoin },
  { name: 'XRP', value: '$0.475', change: '-0.012 (2.46%)', changeType: 'negative' as const, marketType: 'Crypto' as const, icon: Bitcoin },
  { name: 'Cardano (ADA)', value: '$0.38', change: '+0.01 (2.70%)', changeType: 'positive' as const, marketType: 'Crypto' as const, icon: Bitcoin },
  { name: 'BNB', value: '$585.20', change: '-10.50 (1.76%)', changeType: 'negative' as const, marketType: 'Crypto' as const, icon: Bitcoin },
  { name: 'Polygon (MATIC)', value: '$0.57', change: '+0.02 (3.6%)', changeType: 'positive' as const, marketType: 'Crypto' as const, icon: Bitcoin },
  { name: 'Litecoin (LTC)', value: '$74.20', change: '-1.80 (2.36%)', changeType: 'negative' as const, marketType: 'Crypto' as const, icon: Bitcoin },

  // Currencies
  { name: 'USD/INR', value: '₹83.55', change: '+0.02 (0.02%)', changeType: 'positive' as const, marketType: 'Currency' as const, icon: Landmark },
  { name: 'EUR/USD', value: '$1.0715', change: '-0.0010 (0.09%)', changeType: 'negative' as const, marketType: 'Currency' as const, icon: ArrowRightLeft },
  { name: 'GBP/JPY', value: '¥201.23', change: '-0.15 (0.07%)', changeType: 'negative' as const, marketType: 'Currency' as const, icon: ArrowRightLeft },
  { name: 'AUD/USD', value: '$0.6650', change: '-0.0015 (0.22%)', changeType: 'negative' as const, marketType: 'Currency' as const, icon: ArrowRightLeft },
  { name: 'GBP/INR', value: '₹106.10', change: '+0.05 (0.05%)', changeType: 'positive' as const, marketType: 'Currency' as const, icon: Landmark },
  
  // Commodities
  { name: 'Gold (XAU)', value: '$2,320.50', change: '+5.20 (0.22%)', changeType: 'positive' as const, marketType: 'Commodity' as const, icon: Gem },
  { name: 'Silver (XAG)', value: '$29.50', change: '+0.15 (0.51%)', changeType: 'positive' as const, marketType: 'Commodity' as const, icon: Sigma },
  { name: 'Crude Oil (WTI)', value: '$80.15', change: '-0.58 (0.72%)', changeType: 'negative' as const, marketType: 'Commodity' as const, icon: Droplet },
  { name: 'Natural Gas', value: '$2.85', change: '+0.03 (1.06%)', changeType: 'positive' as const, marketType: 'Commodity' as const, icon: Flame },
];

const categories = ['All', 'Stock', 'Crypto', 'Currency', 'Commodity', 'Top Gainers', 'Top Losers'];

export function MarketOverviewSection() {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [marketData, setMarketData] = React.useState(initialMarketData);
  const [searchTerm, setSearchTerm] = React.useState('');
const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  React.useEffect(() => {
    if (!hasMounted) {
      return;
    }

    const interval = setInterval(() => {
      setMarketData(currentData =>
        currentData.map(item => {
          if (Math.random() < 0.2) {
            const valueNum = parseFloat(item.value.replace(/[^0-9.]/g, ''));
            const randomFactor = (Math.random() - 0.5) * 0.02;
            const newValue = valueNum * (1 + randomFactor);
            
            const changeMatch = item.change.match(/([+-][\d,]+\.?\d*)\s\((.*)\)/);
            if (!changeMatch) return item;

            const changeAmount = parseFloat(changeMatch[1].replace(/,/g, ''));
            const newChangeAmount = changeAmount + (newValue - valueNum);

            const openingPrice = valueNum - changeAmount;
            if (openingPrice === 0) return item; // Avoid division by zero
            
            const newChangePercent = (newChangeAmount / openingPrice) * 100;
            const valuePrefix = item.value.startsWith('₹') ? '₹' : item.value.startsWith('$') ? '$' : item.value.startsWith('¥') ? '¥' : '';

            return {
              ...item,
              value: `${valuePrefix}${newValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: item.marketType === 'Currency' ? 4 : 2 })}`,
              change: `${newChangeAmount >= 0 ? '+' : ''}${newChangeAmount.toFixed(2)} (${Math.abs(newChangePercent).toFixed(2)}%)`,
              changeType: newChangeAmount >= 0 ? 'positive' : 'negative',
            };
          }
          return item;
        })
      );
    }, 2000); 

    return () => clearInterval(interval);
   }, [hasMounted]);

  const getChangePercent = (change: string) => {
    const match = change.match(/\(([^%]+)%\)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const filteredAssets = React.useMemo(() => {
     const sourceData = hasMounted ? marketData : initialMarketData;
    let assets = sourceData;

    if (activeCategory === 'Top Gainers') {
      assets = [...assets]
        .filter(a => a.changeType === 'positive')
        .sort((a, b) => getChangePercent(b.change) - getChangePercent(a.change));
    } else if (activeCategory === 'Top Losers') {
      assets = [...assets]
        .filter(a => a.changeType === 'negative')
        .sort((a, b) => getChangePercent(a.change) - getChangePercent(b.change));
    } else if (activeCategory !== 'All') {
      assets = assets.filter(item => item.marketType === activeCategory);
    }
    
    if (searchTerm) {
      assets = assets.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return assets;
 }, [activeCategory, marketData, searchTerm, hasMounted]);

  return (
    <section id="features" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Live Market Snapshots</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real-time data from global markets at your fingertips.
          </p>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:flex-1">
                  <Input
                      type="search"
                      placeholder="Search assets..."
                      className="w-full pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
                <div className="overflow-x-auto pb-2 -mb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  <TabsList className="inline-flex w-max space-x-2">
                      {categories.map((category) => (
                          <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                      ))}
                  </TabsList>
                </div>
              </Tabs>
          </div>
        </div>
      </div>
      
      <div className="mt-8 w-full overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,white_2%,white_98%,transparent)]">
        <div className="flex w-max animate-marquee-slow hover:[animation-play-state:paused]">
          {filteredAssets.length > 0 ? (
            [...filteredAssets, ...filteredAssets].map((item, index) => (
                <div key={`${item.name}-${index}`} className="px-2">
                <MarketCard {...item} />
                </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-20 w-full text-center text-muted-foreground">
              No assets found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
