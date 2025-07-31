'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp } from 'lucide-react';
import StockSearchInput from '@/components/StockSearchInput';

interface Stock {
  symbol: string;
  name: string;
  sector: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  amount: z.coerce.number().min(1, { message: "Investment amount must be positive." }),
  selectedStock: z.string().optional(),
});

interface InterestFormProps {
  formType: string;
}

export function InterestForm({ formType }: InterestFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedStock, setSelectedStock] = React.useState<Stock | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      amount: 0,
      selectedStock: '',
    },
  });

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    form.setValue('selectedStock', stock.symbol);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log({ ...values, type: formType, selectedStock });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const message = formType === 'Stocks' && selectedStock 
      ? `We've received your interest in ${formType} (${selectedStock.symbol}). Our team will contact you shortly.`
      : `We've received your interest in ${formType}. Our team will contact you shortly.`;

    toast({
      title: "Inquiry Sent!",
      description: message,
    });
    form.reset();
    setSelectedStock(null);
    setIsLoading(false);
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Express Your Interest</span>
        </CardTitle>
        <CardDescription>
          {formType === 'Stocks' 
            ? 'Search for stocks and fill out the form below. We\'ll get in touch with personalized investment advice.'
            : 'Fill out the form below and we\'ll get in touch.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Stock Search for Stocks form type */}
            {formType === 'Stocks' && (
              <div className="space-y-2">
                <FormLabel>Search for Stocks</FormLabel>
                <StockSearchInput 
                  onStockSelect={handleStockSelect}
                  placeholder="Search for Indian stocks (e.g., RELIANCE, TCS, HDFCBANK)..."
                />
                {selectedStock && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Selected:</strong> {selectedStock.symbol} - {selectedStock.name}
                    </p>
                  </div>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {formType === 'Stocks' ? 'Get Stock Analysis' : 'Submit Inquiry'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
