
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart, Info } from 'lucide-react';
import type { AssetPredictionOutput } from '@/ai/flows/get-asset-prediction';

interface PredictionResultCardProps {
  ticker: string;
  prediction: AssetPredictionOutput;
}

const InfoRow: React.FC<{ icon: React.ElementType, label: string, value: string | null | undefined, className?: string }> = ({ icon: Icon, label, value, className }) => {
    if (!value) return null;
    return (
        <div className={`flex items-center justify-between py-3 ${className}`}>
            <div className="flex items-center">
            <Icon className="w-5 h-5 mr-3 text-primary" />
            <span className="font-medium text-muted-foreground">{label}</span>
            </div>
            <span className="font-semibold text-foreground">{value}</span>
        </div>
    );
};

export function PredictionResultCard({ ticker, prediction }: PredictionResultCardProps) {
  return (
    <Card className="w-full max-w-lg mx-auto mt-6 shadow-2xl bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-primary">AI Prediction for {ticker.toUpperCase()}</CardTitle>
        <CardDescription>Current Price: <span className="font-bold text-foreground">{prediction.currentPrice}</span></CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="divide-y divide-border/60">
          <InfoRow icon={TrendingUp} label="Predicted Entry Point" value={prediction.entryPoint} />
          <InfoRow icon={TrendingDown} label="Predicted Sell Point" value={prediction.sellPoint} />
          <InfoRow icon={BarChart} label="Indicator Used" value={prediction.indicatorUsed} />
        </div>
        
        {prediction.reason && (
            <div className="mt-4 pt-4 border-t border-border/60">
                <div className="flex items-start">
                    <Info className="w-5 h-5 mr-3 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-medium text-muted-foreground">Reasoning</h4>
                        <p className="text-sm text-foreground mt-1">{prediction.reason}</p>
                    </div>
                </div>
            </div>
        )}

        <p className="text-xs text-muted-foreground italic mt-6 text-center">
          Disclaimer: This is an AI-generated prediction and not financial advice. Always do your own research.
        </p>
      </CardContent>
    </Card>
  );
}
