import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface MarketCardProps {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  marketType: string;
  icon?: React.ElementType;
}

export function MarketCard({ name, value, change, changeType, marketType, icon: Icon }: MarketCardProps) {
  const ChangeIcon = changeType === 'positive' ? ArrowUp : changeType === 'negative' ? ArrowDown : Minus;
  const changeColor = changeType === 'positive' ? 'text-green-500' : changeType === 'negative' ? 'text-red-500' : 'text-muted-foreground';

  const changePercentage = change.match(/\((.*)\)/)?.[1] || '';

  return (
    <a href="#" className="flex-shrink-0">
      <Card className="w-auto p-0 shadow-md hover:shadow-primary/20 transition-shadow duration-300 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-2">
          {Icon && <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
          <div className="font-semibold text-foreground text-sm truncate">{name}</div>
          <div className="text-sm text-foreground">{value}</div>
          <div className={`flex items-center text-xs font-medium ${changeColor}`}>
            <ChangeIcon className="h-3 w-3 mr-0.5" />
            <span>{changePercentage}</span>
          </div>
        </div>
      </Card>
    </a>
  );
}
