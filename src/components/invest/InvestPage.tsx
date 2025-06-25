import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentCategory } from './InvestmentCategory';

const investmentOptions = [
  {
    value: 'stocks',
    label: 'Stocks',
    title: 'Stock Market Investing',
    description: 'Invest in thousands of companies listed on major stock exchanges. Build your wealth by owning shares of businesses you believe in.',
    imageUrl: 'https://placehold.co/1200x400.png',
    imageHint: 'stock market graph',
    steps: [
      { title: 'Research & Select', description: 'Use our AI tools to find promising stocks that match your investment goals.' },
      { title: 'Place Your Order', description: 'Easily buy shares through our secure platform with just a few clicks.' },
      { title: 'Monitor & Manage', description: 'Track your portfolio performance and get AI-driven insights to rebalance.' },
      { title: 'Grow Your Wealth', description: 'Hold your investments for long-term growth or trade based on market predictions.' },
    ]
  },
  {
    value: 'ipo',
    label: 'IPO',
    title: 'Initial Public Offerings (IPOs)',
    description: 'Get in on the ground floor by investing in companies before they go public. IPOs offer a unique opportunity for high growth potential.',
    imageUrl: 'https://placehold.co/1200x400.png',
    imageHint: 'company launch rocket',
    steps: [
      { title: 'Discover Upcoming IPOs', description: 'Get alerts and analysis on new companies entering the public market.' },
      { title: 'Submit Your Application', description: 'Apply for an allotment of shares through our streamlined process.' },
      { title: 'Allotment & Listing', description: 'Once shares are allotted, they will be credited to your account upon listing.' },
      { title: 'Track Listing Gains', description: 'Monitor the stock\'s performance from day one of trading.' },
    ]
  },
  {
    value: 'currency',
    label: 'Currency',
    title: 'Foreign Exchange (Forex) Trading',
    description: 'Trade the world\'s largest financial market. Speculate on the price movements of currency pairs like USD/INR and EUR/USD.',
    imageUrl: 'https://placehold.co/1200x400.png',
    imageHint: 'global currency exchange',
    steps: [
      { title: 'Choose a Currency Pair', description: 'Select from major, minor, and exotic currency pairs to trade.' },
      { title: 'Analyze the Market', description: 'Use our AI predictions and technical charts to forecast price movements.' },
      { title: 'Open a Position', description: 'Go long (buy) or short (sell) based on your market outlook.' },
      { title: 'Manage Your Trade', description: 'Set stop-loss and take-profit orders to manage risk and lock in gains.' },
    ]
  },
  {
    value: 'gold',
    label: 'Gold',
    title: 'Investing in Gold',
    description: 'Diversify your portfolio with a timeless asset. Invest in digital gold or gold ETFs to hedge against inflation and market volatility.',
    imageUrl: 'https://placehold.co/1200x400.png',
    imageHint: 'gold bars safe',
    steps: [
      { title: 'Select Your Gold Product', description: 'Choose between Sovereign Gold Bonds (SGBs), Gold ETFs, or Digital Gold.' },
      { title: 'Make Your Purchase', description: 'Invest a desired amount through our secure and simple platform.' },
      { title: 'Secure Storage', description: 'Your digital gold is stored in insured vaults, and ETFs/SGBs in your demat account.' },
      { title: 'Redeem or Sell', description: 'Easily sell your holdings at market rates whenever you choose.' },
    ]
  },
];

export function InvestPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">Your Gateway to Smart Investing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore various investment opportunities tailored for you, powered by AI insights.
        </p>
      </div>

      <Tabs defaultValue="stocks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          {investmentOptions.map((opt) => (
             <TabsTrigger key={opt.value} value={opt.value}>{opt.label}</TabsTrigger>
          ))}
        </TabsList>
        {investmentOptions.map((opt) => (
          <TabsContent key={opt.value} value={opt.value}>
            <InvestmentCategory
              title={opt.title}
              description={opt.description}
              imageUrl={opt.imageUrl}
              imageHint={opt.imageHint}
              steps={opt.steps}
              formType={opt.label}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
