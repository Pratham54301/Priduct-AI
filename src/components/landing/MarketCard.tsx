import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  return (
    <Card className="p-3 shadow-md hover:shadow-primary/20 transition-shadow duration-300 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          {Icon && <Icon className="h-8 w-8 text-muted-foreground flex-shrink-0" />}
          <div className="overflow-hidden">
            <p className="font-bold text-foreground text-sm truncate">{name}</p>
            <Badge variant="secondary" className="mt-1 text-xs">{marketType}</Badge>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-foreground text-sm">{value}</p>
          <div className={`flex items-center justify-end text-xs ${changeColor}`}>
            <ChangeIcon className="h-3 w-3 mr-1" />
            <span>{change}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
