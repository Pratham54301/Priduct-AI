import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StockPrediction } from '@/types/prediction';
import { format } from 'date-fns';

interface PredictionCardProps {
  prediction: StockPrediction | null;
  onRerunPrediction: () => void;
  isLoading: boolean;
  error: string | null;
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  onRerunPrediction,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto animate-pulse">
        <CardHeader>
          <CardTitle>Generating Prediction...</CardTitle>
          <CardDescription>Please wait while the AI analyzes the stock data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600">Prediction Error</CardTitle>
          <CardDescription>Could not generate prediction.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={onRerunPrediction} className="mt-4" variant="secondary">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No Prediction Available</CardTitle>
          <CardDescription>Search for a stock to get an AI prediction.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your AI stock predictions will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  const isStale = prediction.status === 'stale_data';
  const isInsufficient = prediction.status === 'insufficient_data';

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          {prediction.symbol} <span className="text-lg text-gray-500">({prediction.exchange})</span>
        </CardTitle>
        <Badge variant={isStale || isInsufficient ? "destructive" : "success"}>
          {isInsufficient ? "Insufficient Data" : isStale ? "Stale Data" : prediction.status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Current Price:</p>
          <p className="text-2xl font-semibold">
            {prediction.current_price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
          </p>
        </div>

        {!isInsufficient && !isStale && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Entry Point:</p>
              <p className="font-medium">
                {prediction.entry_point?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Sell Point:</p>
              <p className="font-medium">
                {prediction.sell_point?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Target 1:</p>
              <p className="font-medium">
                {prediction.target_1?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Target 2:</p>
              <p className="font-medium">
                {prediction.target_2?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Accuracy:</p>
              <p className="font-medium">{(prediction.prediction_accuracy * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Indicators:</p>
              <p className="font-medium">{prediction.indicators_used?.join(', ')}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Rationale:</p>
              <p className="font-normal text-sm italic">{prediction.rationale}</p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2">
          Last Updated: {prediction.timestamp ? format(new Date(prediction.timestamp), 'PPpp') : 'N/A'}
        </div>

        <Button onClick={onRerunPrediction} disabled={isLoading} className="w-full mt-4">
          {isLoading ? 'Re-running...' : 'Re-run Prediction'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
