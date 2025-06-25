import { MarketCard } from './MarketCard';
import { AreaChart, Bitcoin, Gem, Droplet, Landmark, Sigma } from 'lucide-react';

const marketData = [
  { name: 'Nifty 50', value: '23,501.10', change: '+183.45 (0.79%)', changeType: 'positive' as const, marketType: 'Index (IN)', icon: AreaChart },
  { name: 'Sensex', value: '77,209.90', change: '+620.73 (0.80%)', changeType: 'positive' as const, marketType: 'Index (IN)', icon: AreaChart },
  { name: 'Nasdaq', value: '17,857.02', change: '-32.23 (0.18%)', changeType: 'negative' as const, marketType: 'Index (US)', icon: AreaChart },
  { name: 'S&P 500', value: '5,473.62', change: '+1.39 (0.03%)', changeType: 'positive' as const, marketType: 'Index (US)', icon: AreaChart },
  { name: 'Bitcoin (BTC)', value: '$65,123.45', change: '-$500.12 (0.76%)', changeType: 'negative' as const, marketType: 'Crypto', icon: Bitcoin },
  { name: 'Silver', value: '$29.50', change: '+$0.15 (0.51%)', changeType: 'positive' as const, marketType: 'Commodity', icon: Sigma },
  { name: 'Gold (XAU)', value: '$2,320.50', change: '+$5.20 (0.22%)', changeType: 'positive' as const, marketType: 'Commodity', icon: Gem },
  { name: 'Crude Oil (WTI)', value: '$80.15', change: '-$0.58 (0.72%)', changeType: 'negative' as const, marketType: 'Commodity', icon: Droplet },
  { name: 'USD/INR', value: '₹83.55', change: '+₹0.02 (0.02%)', changeType: 'positive' as const, marketType: 'Currency', icon: Landmark },
  { name: 'EUR/USD', value: '$1.0715', change: '-$0.0010 (0.09%)', changeType: 'negative' as const, marketType: 'Currency', icon: Landmark },
];

export function MarketOverviewSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Live Market Snapshots</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real-time data from global markets at your fingertips.
          </p>
        </div>
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...marketData, ...marketData].map((item, index) => (
              <div key={index} className="w-72 flex-shrink-0 px-3">
                <MarketCard
                  key={item.name}
                  name={item.name}
                  value={item.value}
                  change={item.change}
                  changeType={item.changeType}
                  marketType={item.marketType}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
