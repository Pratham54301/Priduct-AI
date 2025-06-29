
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Briefcase, Landmark, Coins, Gem, Droplet, Bitcoin, DollarSign, Euro, PoundSterling, Sigma, Sparkles, Loader2 } from 'lucide-react';
import { getAssetPrediction, type AssetPredictionOutput } from '@/ai/flows/get-asset-prediction';
import { PredictionResultCard } from './PredictionResultCard';
import { useToast } from '@/hooks/use-toast';

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
  { name: 'Silver', logo: Sigma, type: 'Commodody', dataAiHint: 'silver nugget' },
  { name: 'Bitcoin', logo: Bitcoin, type: 'Crypto', dataAiHint: 'bitcoin logo orange' },
  { name: 'Ethereum', logo: Gem, type: 'Crypto', dataAiHint: 'ethereum logo diamond' },
  { name: 'Solana', logo: 'SOL', type: 'Crypto', dataAiHint: 'solana logo purple' },
  { name: 'USD/INR', logo: () => <div className="flex items-center justify-center text-sm"><DollarSign size={16} /><span className="mx-0.5">/</span>₹</div>, type: 'Currency', dataAiHint: 'dollar rupee currency' },
  { name: 'EUR/USD', logo: () => <div className="flex items-center justify-center text-sm"><Euro size={16} /><span className="mx-0.5">/</span><DollarSign size={16}/></div>, type: 'Currency', dataAiHint: 'euro dollar currency' },
];

const ItemLogoButton: React.FC<{ item: MarketItem, onClick: (ticker: string) => void }> = ({ item, onClick }) => {
  let DefaultIcon;
  switch (item.type) {
    case 'Stock': DefaultIcon = Briefcase; break;
    case 'Commodity': DefaultIcon = Coins; break;
    case 'Crypto': DefaultIcon = Bitcoin; break;
    case 'Currency': DefaultIcon = Landmark; break;
    default: DefaultIcon = Briefcase;
  }
  const IconComponent = typeof item.logo === 'string' ? null : item.logo;

  return (
    <div className="flex flex-col items-center space-y-1.5 flex-shrink-0 w-24 text-center">
      <Button
        variant="outline"
        className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-background p-0 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary"
        aria-label={item.name}
        data-ai-hint={item.dataAiHint || item.name.toLowerCase()}
        onClick={() => onClick(typeof item.logo === 'string' ? item.logo : item.name)}
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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [prediction, setPrediction] = React.useState<AssetPredictionOutput | null>(null);
  const [predictedTicker, setPredictedTicker] = React.useState('');
  
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
  
  const handleGetPrediction = async (ticker: string) => {
    if (!ticker.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a ticker symbol.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setPrediction(null);
    setPredictedTicker(ticker);

    try {
      const result = await getAssetPrediction({ ticker });
      
      if (result.error) {
        // AI returned a specific error for the ticker
        toast({
          title: "Prediction Error",
          description: result.error,
          variant: "destructive",
        });
        setPrediction(null); // Clear any previous valid prediction
      } else {
        // Successful prediction
        setPrediction(result);
      }
    } catch (error) {
      // General failure (API down, network error, etc.)
      console.error("Prediction failed:", error); // Log detailed error
      toast({
        title: "Prediction Failed",
        description: "The prediction service is currently unavailable. Please try again in a few seconds.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGetPrediction(searchTerm);
    setFilteredSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setFilteredSuggestions([]);
    handleGetPrediction(suggestion);
  }

  return (
    <section className="py-10 md:py-12 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[36px] leading-[46px] sm:text-[36px] sm:leading-[46px] font-bold tracking-tight text-foreground font-headline text-center">
            Predict Tomorrow's Markets Today with AI
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-xl font-medium leading-relaxed text-muted-foreground">
            Stocks, crypto, commodities, and more.
          </p>
        </div>

        <div className="max-w-lg mx-auto mt-6">
          <Card className="bg-card p-4 md:p-6 shadow-xl rounded-xl">
            <h3 className="text-base font-semibold text-primary mb-2 text-center flex items-center justify-center">
              <Sparkles className="w-4 h-4 mr-2 text-primary" /> AI Prediction Machine
            </h3>
            
            <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                  <Input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter a stock ticker, currency pair, commodity, or crypto name."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 dark:border-border shadow-sm focus:ring-primary focus:border-primary text-sm bg-background text-foreground placeholder:text-muted-foreground"
                    aria-label="Search for predictions"
                    disabled={isLoading}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  {filteredSuggestions.length > 0 && searchTerm.trim() && (
                    <Card className="absolute z-10 w-full mt-1 bg-card shadow-lg rounded-md border border-border max-h-60 overflow-y-auto">
                      {filteredSuggestions.map(suggestion => (
                        <div
                          key={suggestion}
                          className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </Card>
                  )}
              </div>

              <Button type="submit" className="w-full sm:w-auto shrink-0 font-semibold py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  {isLoading ? 'Analyzing...' : 'Get Prediction'}
              </Button>
            </form>
          </Card>
        </div>
        
        {isLoading && !prediction && (
          <div className="text-center mt-6">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Generating AI prediction for {predictedTicker.toUpperCase()}...</p>
          </div>
        )}

        {prediction && (
          <PredictionResultCard ticker={predictedTicker} prediction={prediction} />
        )}

        <div className="max-w-5xl mx-auto mt-8">
           <p className="text-xs text-center text-muted-foreground mb-3">Or pick from popular assets:</p>
          <div className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
            {marketItems.map((item) => (
              <ItemLogoButton key={item.name} item={item} onClick={handleGetPrediction} />
            ))}
          </div>
        </div>

        <div className="max-w-3xl text-center mx-auto mt-6">
          <p className="text-xs text-muted-foreground italic">
            These predictions are AI-generated and for informational purposes only. Markets involve risk.
          </p>
        </div>
      </div>
    </section>
  );
}
