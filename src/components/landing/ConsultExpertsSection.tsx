import * as React from 'react';
import { ExpertCard } from './ExpertCard';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const experts = [
  {
    name: 'Dr. Alisha Verma',
    title: 'Stock Market Strategist',
    photoUrl: 'https://placehold.co/192x192.png',
    specialties: ['Equities', 'Derivatives', 'IPO Analysis'],
    rating: 4.9,
    imageHint: 'woman financial advisor'
  },
  {
    name: 'Vikram Singh',
    title: 'Crypto &amp; Blockchain Analyst',
    photoUrl: 'https://placehold.co/192x192.png',
    specialties: ['Bitcoin', 'Altcoins', 'DeFi', 'NFTs'],
    rating: 4.7,
    imageHint: 'man crypto expert'
  },
  {
    name: 'Neha Reddy',
    title: 'Forex &amp; Commodities Expert',
    photoUrl: 'https://placehold.co/192x192.png',
    specialties: ['FX Trading', 'Gold', 'Oil', 'Global Macro'],
    rating: 4.8,
    imageHint: 'person forex trader'
  },
];

const filters = ['All', 'Stock', 'Crypto', 'Forex', 'Commodities'];

export function ConsultExpertsSection() {
  // Basic state for active filter, can be expanded for actual filtering logic
  const [activeFilter, setActiveFilter] = React.useState('All');

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Learn from Market Masters</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect with verified professionals for personalized guidance.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter)}
              className={`capitalize ${activeFilter === filter ? 'bg-primary text-primary-foreground' : 'border-primary text-primary hover:bg-primary/10'}`}
            >
              <Filter className="mr-2 h-4 w-4" />
              {filter}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {experts.map((expert) => (
            <ExpertCard key={expert.name} {...expert} />
          ))}
        </div>
      </div>
    </section>
  );
}
