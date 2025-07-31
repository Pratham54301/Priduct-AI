
'use client';

import React, { useState } from 'react';
import StockSearchInput from '@/components/StockSearchInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Calendar, Target, BarChart3 } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  sector: string;
}

export default function StockSearchPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setPrediction(null);
  };

  const getPrediction = async () => {
    if (!selectedStock) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock prediction data
      const mockPrediction = {
        symbol: selectedStock.symbol,
        prediction: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        targetPrice: Math.floor(Math.random() * 1000) + 100,
        timeframe: '1 Week',
        reasoning: [
          'Strong technical indicators suggest upward momentum',
          'Positive earnings outlook for the sector',
          'Market sentiment analysis shows favorable conditions',
          'Volume analysis indicates institutional buying'
        ]
      };
      
      setPrediction(mockPrediction);
    } catch (error) {
      console.error('Error getting prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case 'Bullish':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'Bearish':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'Bullish':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Bearish':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Stock Prediction Search</h1>
          <p className="text-muted-foreground">
            Search for Indian stocks and get AI-powered predictions
          </p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <StockSearchInput 
              onStockSelect={handleStockSelect}
              placeholder="Type company name or symbol (e.g., RELIANCE, TCS, HDFCBANK)..."
              className="max-w-2xl"
            />
          </CardContent>
        </Card>

        {/* Selected Stock Info */}
        {selectedStock && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedStock.symbol}</h3>
                  <p className="text-muted-foreground">{selectedStock.name}</p>
                  <Badge variant="secondary" className="mt-2">
                    {selectedStock.sector}
                  </Badge>
                </div>
                <Button 
                  onClick={getPrediction}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Get AI Prediction
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prediction Result */}
        {prediction && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>AI Prediction Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Prediction Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-card border rounded-lg">
                    {getPredictionIcon(prediction.prediction)}
                    <div>
                      <p className="text-sm text-muted-foreground">Prediction</p>
                      <p className="font-semibold">{prediction.prediction}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-card border rounded-lg">
                    <Target className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Target Price</p>
                      <p className="font-semibold">₹{prediction.targetPrice}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-card border rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Timeframe</p>
                      <p className="font-semibold">{prediction.timeframe}</p>
                    </div>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Confidence Score</span>
                    <span className="text-sm font-semibold">{prediction.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-blue-600 h-2 rounded-full transition-all duration-300 confidence-bar-${prediction.confidence}`}
                    ></div>
                  </div>
                </div>

                {/* Reasoning */}
                <div className="space-y-3">
                  <h4 className="font-semibold">AI Reasoning</h4>
                  <ul className="space-y-2">
                    {prediction.reasoning.map((reason: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Disclaimer:</strong> This prediction is for educational purposes only. 
                    Always do your own research and consult with financial advisors before making investment decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <p className="text-sm text-muted-foreground">
                  Type a company name or stock symbol in the search box above
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <p className="text-sm text-muted-foreground">
                  Select a stock from the dropdown suggestions
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <p className="text-sm text-muted-foreground">
                  Click "Get AI Prediction" to receive AI-powered analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 