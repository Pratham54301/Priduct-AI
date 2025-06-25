import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Minus, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <Card className="h-full group relative flex flex-col overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
             {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
             {name}
          </CardTitle>
          <Badge variant="outline" className="text-xs">{marketType}</Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">Live Price</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <div className={`mt-1 flex items-center text-sm ${changeColor}`}>
          <ChangeIcon className="mr-1 h-4 w-4" />
          <span>{change}</span>
        </div>
        <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            View Full Prediction <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
