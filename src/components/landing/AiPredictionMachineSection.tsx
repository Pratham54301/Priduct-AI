
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Briefcase, Landmark, Coins, Gem, Droplet, Bitcoin, DollarSign, Euro, PoundSterling, Sigma, Sparkles } from 'lucide-react'; // Added Sparkles for AI emphasis

interface MarketItem {
  name: string;
  logo?: React.ElementType | string;
  dataAiHint?: string;
  type: 'Stock' | 'Commodity' | 'Crypto' | 'Currency';
}

const marketItems: MarketItem[] = [
  { name: 'Infosys', logo: 'INFY', type: 'Stock', dataAiHint: 'infosys logo' },
  { name: 'HDFC Bank', logo: 'HDFC', type: 'Stock', dataAiHint: 'hdfc bank logo' },
  { name: 'Apple', logo: 'AAPL', type: 'Stock', dataAiHint: 'apple inc logo' },
  { name: 'Tesla', logo: 'TSLA', type: 'Stock', dataAiHint: 'tesla logo' },
  { name: 'Microsoft', logo: 'MSFT', type: 'Stock', dataAiHint: 'microsoft logo' },
  { name: 'Amazon', logo: 'AMZN', type: 'Stock', dataAiHint: 'amazon logo' },
  { name: 'Gold', logo: Gem, type: 'Commodity', dataAiHint: 'gold bar' },
  { name: 'Crude Oil', logo: Droplet, type: 'Commodity', dataAiHint: 'oil barrel' },
  { name: 'Silver', logo: Sigma, type: 'Commodity', dataAiHint: 'silver nugget' }, // Sigma as placeholder
  { name: 'Bitcoin', logo: Bitcoin, type: 'Crypto', dataAiHint: 'bitcoin logo orange' },
  { name: 'Ethereum', logo: Gem, type: 'Crypto', dataAiHint: 'ethereum logo diamond' }, // Gem as placeholder for ETH diamond
  { name: 'Solana', logo: 'SOL', type: 'Crypto', dataAiHint: 'solana logo purple' },
  { name: 'USD/INR', logo: () => <div className="flex items-center justify-center text-sm"><DollarSign size={16} /><span className="mx-0.5">/</span>₹</div>, type: 'Currency', dataAiHint: 'dollar rupee currency' },
  { name: 'EUR/USD', logo: () => <div className="flex items-center justify-center text-sm"><Euro size={16} /><span className="mx-0.5">/</span><DollarSign size={16}/></div>, type: 'Currency', dataAiHint: 'euro dollar currency' },
];

const ItemLogoButton: React.FC<{ item: MarketItem }> = ({ item }) => {
  const IconComponent = typeof item.logo === 'string' ? null : item.logo;
  let DefaultIcon;
  switch (item.type) {
    case 'Stock': DefaultIcon = Briefcase; break;
    case 'Commodity': DefaultIcon = Coins; break;
    case 'Crypto': DefaultIcon = Bitcoin; break;
    case 'Currency': DefaultIcon = Landmark; break; // Placeholder, specific logos handled by function
    default: DefaultIcon = Briefcase;
  }

  return (
    <div className="flex flex-col items-center space-y-1.5 flex-shrink-0 w-24 text-center">
      <Button
        variant="outline"
        className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-background p-0 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary"
        aria-label={item.name}
        data-ai-hint={item.dataAiHint || item.name.toLowerCase()}
      >
        {IconComponent ? (
          <IconComponent className="w-8 h-8 text-primary" />
        ) : typeof item.logo === 'string' ? (
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{item.logo}</span>
        ) : (
          <DefaultIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        )}
      </Button>
      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate w-full">{item.name}</span>
    </div>
  );
};


export function AiPredictionMachineSection() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const suggestions = ['TCS', 'RELIANCE', 'TSLA', 'AAPL', 'BTC', 'ETH', 'USDINR', 'GOLD', 'Infosys', 'HDFC Bank', 'Microsoft', 'Amazon', 'Crude Oil', 'Silver', 'Solana', 'EUR/USD'];
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredSuggestions(
        suggestions.filter(s => s.toLowerCase().startsWith(searchTerm.toLowerCase().trim()))
      );
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <section className="py-12 md:py-20 bg-zinc-800 text-foreground">
      <div className="container mx-auto max-w-3xl text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground font-headline">
          Predict Tomorrow's Markets Today with AI-Powered Precision
        </h2>
        <div className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground space-y-2">
           <p>
            Transform your investment strategy with cutting-edge predictions powered by real-time data, technical indicators, and market intelligence.
          </p>
          <p>
            Our advanced algorithms analyze thousands of data points to deliver accurate forecasts for stocks, crypto, commodities, and more.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-lg px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        <Card className="bg-card p-6 md:p-8 shadow-xl rounded-xl">
          <h3 className="text-2xl font-semibold text-primary mb-2 text-center flex items-center justify-center">
            <Sparkles className="w-7 h-7 mr-2 text-primary" /> AI Prediction Machine
          </h3>
          <p className="text-muted-foreground text-sm text-center mb-1">
            Enter a stock ticker, currency pair, commodity, or crypto name.
          </p>
          <p className="text-xs text-accent dark:text-accent-foreground font-semibold text-center mb-6 bg-accent/10 dark:bg-accent/20 py-1 px-3 rounded-full inline-block mx-auto">
            3 / 3 free predictions remaining
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
                <Input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g., Bitcoin, AAPL, USD/INR, Gold"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-gray-300 dark:border-border shadow-sm focus:ring-primary focus:border-primary text-base bg-background text-foreground placeholder:text-muted-foreground"
                  aria-label="Search for predictions"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                {filteredSuggestions.length > 0 && searchTerm.trim() && (
                  <Card className="absolute z-10 w-full mt-1 bg-card shadow-lg rounded-md border border-border max-h-60 overflow-y-auto">
                    {filteredSuggestions.map(suggestion => (
                      <div
                        key={suggestion}
                        className="px-4 py-2 hover:bg-muted cursor-pointer"
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

            <Button className="w-full sm:w-auto shrink-0 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 text-base rounded-lg">
                <Sparkles className="w-5 h-5 mr-2" /> Get Prediction
            </Button>
          </div>

        </Card>
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-10 md:mt-16">
         <p className="text-sm text-center text-muted-foreground mb-4">Or pick from popular assets:</p>
        <div className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800 scrollbar-thumb-rounded-full">
          {marketItems.map((item) => (
            <ItemLogoButton key={item.name} item={item} />
          ))}
        </div>
      </div>

      <div className="container mx-auto max-w-3xl text-center px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        <p className="text-xs text-muted-foreground italic">
          These predictions are AI-generated and for informational purposes only. Markets involve risk.
        </p>
      </div>
    </section>
  );
}
