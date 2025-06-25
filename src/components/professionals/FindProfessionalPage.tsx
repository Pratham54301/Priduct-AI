'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfessionalCard } from './ProfessionalCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

const professionals = [
  { name: 'Dr. Alisha Verma', profession: 'Stock Market Strategist', location: 'Mumbai', rating: 4.9, photoUrl: 'https://placehold.co/192x192.png', imageHint: 'woman financial advisor' },
  { name: 'Vikram Singh', profession: 'Crypto & Blockchain Analyst', location: 'Bengaluru', rating: 4.7, photoUrl: 'https://placehold.co/192x192.png', imageHint: 'man crypto expert' },
  { name: 'Neha Reddy', profession: 'Forex & Commodities Expert', location: 'Delhi', rating: 4.8, photoUrl: 'https://placehold.co/192x192.png', imageHint: 'person forex trader' },
  { name: 'Ravi Sharma', profession: 'Financial Planner', location: 'Pune', rating: 4.9, photoUrl: 'https://placehold.co/192x192.png', imageHint: 'man financial planner' },
  { name: 'Sunita Patil', profession: 'IPO Analyst', location: 'Hyderabad', rating: 4.6, photoUrl: 'https://placehold.co/192x192.png', imageHint: 'woman analyst' },
  { name: 'Amit Kumar', profession: 'Wealth Manager', location: 'Chennai', rating: 5.0, photoUrl: 'https://placehold.co/192x192.png', imageHint: 'professional wealth manager' },
];

export function FindProfessionalPage() {
  return (
    <div className="bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">Find Your Financial Expert</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect with top-rated professionals to guide your investment journey.
          </p>
        </div>

        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle>Get Matched Instantly</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <label htmlFor="service" className="block text-sm font-medium text-muted-foreground mb-1">What service are you looking for?</label>
                <Input id="service" placeholder="e.g., Stock Advisor, Crypto Analyst" />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
                <Input id="location" placeholder="e.g., Mumbai" />
              </div>
              <Button className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Find Professionals
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {professionals.map((prof, index) => (
            <ProfessionalCard key={index} {...prof} />
          ))}
        </div>
      </div>
    </div>
  );
}
