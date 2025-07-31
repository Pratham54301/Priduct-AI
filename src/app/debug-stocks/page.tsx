import StockSearchDebug from '@/components/StockSearchDebug';

export default function DebugStocksPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Stock Search Debug</h1>
        <StockSearchDebug />
      </div>
    </div>
  );
} 