import { BlogCard } from './BlogCard';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

const blogPosts = [
  {
    title: 'AI Predicts Next Big Stock Move: What You Need to Know',
    excerpt: 'Our latest AI models are flagging a significant shift in the tech sector. Dive deep into the data and our analysis.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Stock Predictions',
    author: 'PriductAI Team',
    date: 'July 28, 2024',
    slug: 'ai-stock-prediction-july-2024',
    imageHint: 'stock chart'
  },
  {
    title: 'Crypto Trends Q3 2024: Beyond Bitcoin and Ethereum',
    excerpt: 'Explore emerging cryptocurrencies and DeFi projects that are set to make waves in the coming quarter.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Crypto Trends',
    author: 'Jane Doe, Crypto Analyst',
    date: 'July 25, 2024',
    slug: 'crypto-trends-q3-2024',
    imageHint: 'cryptocurrency coins'
  },
  {
    title: 'Expert Interview: Navigating Volatility with Dr. Smith',
    excerpt: 'We sit down with renowned economist Dr. Emily Smith to discuss strategies for thriving in uncertain market conditions.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Expert Interviews',
    author: 'PriductAI Insights',
    date: 'July 22, 2024',
    slug: 'expert-interview-dr-smith',
    imageHint: 'interview discussion'
  },
];

const categories = ['All', 'Stock Predictions', 'Crypto Trends', 'Expert Interviews', 'Risk Strategies'];

export function BlogInsightsSection() {
  // Basic state for active category, can be expanded for actual filtering logic
  const [activeCategory, setActiveCategory] = React.useState('All');

  return (
    <section id="blog" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Daily Market Insights &amp; Forecasts</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Stay ahead with expert analysis, predictions, and strategies.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className={`capitalize ${activeCategory === category ? 'bg-primary text-primary-foreground' : 'border-primary text-primary hover:bg-primary/10'}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            Write for Us <Edit className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// Add React import for useState
import * as React from 'react';
