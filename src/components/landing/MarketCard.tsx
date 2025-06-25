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

  const changeValue = change.split(' ')[0] || '';
  const changePercentage = change.match(/\((.*)\)/)?.[1] || '';

  return (
    <Card className="w-[240px] p-3 shadow-md hover:shadow-primary/20 transition-shadow duration-300 bg-card/50 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-8 w-8 text-muted-foreground flex-shrink-0" />}
        <div className="overflow-hidden flex-grow">
          <p className="font-bold text-foreground text-sm truncate">{name}</p>
          <p className="font-semibold text-foreground text-sm">{value}</p>
        </div>
        <div className={`text-right text-xs font-medium ${changeColor} flex-shrink-0`}>
          <p>{changeValue}</p>
          {changePercentage && <p>({changePercentage})</p>}
        </div>
      </div>
    </Card>
  );
}
