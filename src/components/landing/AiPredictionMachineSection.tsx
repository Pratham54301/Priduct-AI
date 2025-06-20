
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Plus, Briefcase, Landmark, TrendingUp, Coins, Banknote, Droplet, Gem, Bitcoin, DollarSign, Euro, PoundSterling, SquareTerminal, Building, GanttChartSquare, Sigma } from 'lucide-react';

interface CategoryItem {
  name: string;
  icon: React.ElementType;
  items: Array<{ name: string; logo?: React.ElementType | string; dataAiHint?: string }>;
}

const categories: CategoryItem[] = [
  {
    name: 'Indian Stocks',
    icon: Landmark, // Representing BSE/NSE building or general finance
    items: [
      { name: 'TCS', logo: 'TCS', dataAiHint: 'company logo' },
      { name: 'Reliance', logo: 'RIL', dataAiHint: 'company logo' },
      { name: 'Infosys', logo: 'INFY', dataAiHint: 'company logo' },
      { name: 'HDFC Bank', logo: 'HDFC', dataAiHint: 'company logo' },
    ],
  },
  {
    name: 'US Stocks',
    icon: Briefcase, // General business/stocks
    items: [
      { name: 'Apple', logo: 'AAPL', dataAiHint: 'company logo' },
      { name: 'Tesla', logo: 'TSLA', dataAiHint: 'company logo' },
      { name: 'Microsoft', logo: 'MSFT', dataAiHint: 'company logo' },
      { name: 'Amazon', logo: 'AMZN', dataAiHint: 'company logo' },
    ],
  },
  {
    name: 'Commodities',
    icon: Coins,
    items: [
      { name: 'Gold', logo: Gem, dataAiHint: 'gold bar' }, // Lucide Gem as gold bar
      { name: 'Crude Oil', logo: Droplet, dataAiHint: 'oil barrel' },
      { name: 'Silver', logo: Sigma, dataAiHint: 'silver nugget' }, // Lucide Sigma as a placeholder for silver
    ],
  },
  {
    name: 'Cryptocurrencies',
    icon: Bitcoin,
    items: [
      { name: 'Bitcoin', logo: Bitcoin, dataAiHint: 'bitcoin logo orange' },
      { name: 'Ethereum', logo: Gem, dataAiHint: 'ethereum logo' }, // Lucide Gem similar to ETH diamond
      { name: 'Solana', logo: 'SOL', dataAiHint: 'solana logo purple green' },
    ],
  },
  {
    name: 'Currency Pairs',
    icon: Banknote,
    items: [
      { name: 'USD/INR', logo: () => <div className="flex items-center justify-center"><DollarSign size={24} /><span className="mx-0.5">/</span>₹</div>, dataAiHint: 'dollar rupee' },
      { name: 'EUR/USD', logo: () => <div className="flex items-center justify-center"><Euro size={24} /><span className="mx-0.5">/</span><DollarSign size={24}/></div>, dataAiHint: 'euro dollar' },
      { name: 'GBP/INR', logo: () => <div className="flex items-center justify-center"><PoundSterling size={24} /><span className="mx-0.5">/</span>₹</div>, dataAiHint: 'pound rupee' },
    ],
  },
  {
    name: 'More',
    icon: Plus,
    items: [], // No specific items for 'More', it implies further navigation or options
  },
];

const CategoryLogoButton: React.FC<{ item: { name: string; logo?: React.ElementType | string; dataAiHint?: string }, categoryIcon: React.ElementType }> = ({ item, categoryIcon }) => {
  const IconComponent = typeof item.logo === 'string' ? null : item.logo || categoryIcon;
  return (
    <div className="flex flex-col items-center space-y-2 flex-shrink-0 w-28 text-center">
      <Button
        variant="outline"
        className="w-20 h-20 rounded-full border-2 border-gray-300 bg-white p-0 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary"
        aria-label={item.name}
        data-ai-hint={item.dataAiHint || item.name.toLowerCase()}
      >
        {IconComponent ? (
          <IconComponent className="w-10 h-10 text-primary" />
        ) : (
          <span className="text-xl font-semibold text-gray-700">{item.logo}</span>
        )}
      </Button>
      <span className="text-xs text-gray-700 font-medium truncate w-full">{item.name}</span>
    </div>
  );
};


export function AiPredictionMachineSection() {
  const [searchTerm, setSearchTerm] = React.useState('');
  // Mock suggestions - a full implementation would require more logic
  const suggestions = ['TCS', 'RELIANCE', 'TSLA', 'AAPL', 'BTC', 'ETH', 'USDINR', 'GOLD'];
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (searchTerm) {
      setFilteredSuggestions(
        suggestions.filter(s => s.toLowerCase().startsWith(searchTerm.toLowerCase()))
      );
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <section className="py-12 md:py-16 bg-gray-100 text-gray-800"> {/* Tailwind bg-gray-200 is #E5E7EB, text-gray-800 is #1F2937 */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-gray-900">
            Predict Tomorrow's Markets Today with AI-Powered Precision
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
            Transform your investment strategy with cutting-edge predictions powered by real-time data, technical indicators, and global market intelligence. Our advanced algorithms analyze thousands of data points to deliver accurate forecasts for stocks, crypto, commodities, and more.
          </p>
        </div>

        <Card className="p-4 sm:p-6 mb-8 md:mb-12 shadow-lg bg-white max-w-md mx-auto">
          <div className="flex items-center justify-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md">
            3 / 3 free predictions remaining
          </div>
        </Card>

        <div className="max-w-2xl mx-auto mb-8 md:mb-12 relative">
          <div className="relative">
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter a stock ticker, currency pair, commodity, or crypto name."
              className="w-full pl-12 pr-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary text-base"
              aria-label="Search for predictions"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          </div>
          {filteredSuggestions.length > 0 && searchTerm && (
            <Card className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
              {filteredSuggestions.map(suggestion => (
                <div
                  key={suggestion}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setFilteredSuggestions([]);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </Card>
          )}
        </div>

        <div className="mb-8 md:mb-12">
          {categories.map((category, index) => (
            <div key={category.name} className={`${index > 0 ? 'mt-8' : ''}`}>
              <div className="flex items-center mb-4">
                <category.icon className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
              </div>
              <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {category.items.length > 0 ? category.items.map((item) => (
                  <CategoryLogoButton key={item.name} item={item} categoryIcon={category.icon} />
                )) : (
                  category.name === 'More' && <CategoryLogoButton item={{ name: 'More', logo: Plus, dataAiHint:"view all categories" }} categoryIcon={Plus} />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 italic">
            These predictions are AI-generated and for informational purposes only. Markets involve risk.
          </p>
        </div>
      </div>
    </section>
  );
}
