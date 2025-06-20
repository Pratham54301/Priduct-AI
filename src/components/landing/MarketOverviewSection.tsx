import { MarketCard } from './MarketCard';

const marketData = [
  { name: 'Nifty 50', value: '23,501.10', change: '+183.45 (0.79%)', changeType: 'positive' as const, marketType: 'Index (IN)' },
  { name: 'Sensex', value: '77,209.90', change: '+620.73 (0.80%)', changeType: 'positive' as const, marketType: 'Index (IN)' },
  { name: 'Nasdaq', value: '17,857.02', change: '-32.23 (0.18%)', changeType: 'negative' as const, marketType: 'Index (US)' },
  { name: 'S&P 500', value: '5,473.62', change: '+1.39 (0.03%)', changeType: 'positive' as const, marketType: 'Index (US)' },
  { name: 'Bitcoin (BTC)', value: '$65,123.45', change: '-$500.12 (0.76%)', changeType: 'negative' as const, marketType: 'Crypto' },
  { name: 'Ethereum (ETH)', value: '$3,540.00', change: '+$25.50 (0.72%)', changeType: 'positive' as const, marketType: 'Crypto' },
  { name: 'Gold (XAU)', value: '$2,320.50', change: '+$5.20 (0.22%)', changeType: 'positive' as const, marketType: 'Commodity' },
  { name: 'Crude Oil (WTI)', value: '$80.15', change: '-$0.58 (0.72%)', changeType: 'negative' as const, marketType: 'Commodity' },
  { name: 'USD/INR', value: '₹83.55', change: '+₹0.02 (0.02%)', changeType: 'positive' as const, marketType: 'Currency' },
  { name: 'EUR/USD', value: '$1.0715', change: '-$0.0010 (0.09%)', changeType: 'negative' as const, marketType: 'Currency' },
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {marketData.map((item) => (
            <MarketCard
              key={item.name}
              name={item.name}
              value={item.value}
              change={item.change}
              changeType={item.changeType}
              marketType={item.marketType}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
