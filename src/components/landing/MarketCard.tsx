import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MarketCardProps {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  marketType: 'Stock' | 'Crypto' | 'Currency' | 'Commodity';
  icon?: React.ElementType;
}

export function MarketCard({ name, value, change, changeType, marketType, icon: Icon }: MarketCardProps) {
  const ChangeIcon = changeType === 'positive' ? ArrowUp : changeType === 'negative' ? ArrowDown : Minus;
  const changeColor = changeType === 'positive' ? 'text-green-500' : changeType === 'negative' ? 'text-red-500' : 'text-muted-foreground';
  const changePercentage = change.match(/\((.*)\)/)?.[1] || '';

  const categoryVariant = (marketType: string) => {
    switch (marketType) {
        case 'Stock': return 'default';
        case 'Crypto': return 'secondary';
        case 'Currency': return 'outline';
        case 'Commodity': return 'destructive';
        default: return 'default';
    }
  }


  return (
    <a href="#" className="flex-shrink-0">
      <Card className="w-auto p-0 shadow-md hover:shadow-primary/20 transition-shadow duration-300 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-5 py-3">
          {Icon && <Icon className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
          <div className="flex flex-col items-start">
            <span className="font-semibold text-foreground text-sm truncate">{name}</span>
            <Badge variant={categoryVariant(marketType)} className="text-xs mt-1">{marketType}</Badge>
          </div>
          <div className="flex flex-col items-end ml-auto text-right">
             <div className="text-sm font-semibold text-foreground">{value}</div>
             <div className={`flex items-center text-xs font-medium ${changeColor}`}>
                <ChangeIcon className="h-3 w-3 mr-0.5" />
                <span>{changePercentage}</span>
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}
