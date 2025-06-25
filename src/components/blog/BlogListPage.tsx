'use client';
import * as React from 'react';
import { BlogCard } from '@/components/landing/BlogCard';
import { Button } from '@/components/ui/button';

export const blogPosts = [
  {
    title: 'AI Predicts Next Big Stock Move: What You Need to Know',
    excerpt: 'Our latest AI models are flagging a significant shift in the tech sector. Dive deep into the data and our analysis.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Stock Predictions',
    author: 'PriductAI Team',
    date: 'July 28, 2024',
    slug: 'ai-stock-prediction-july-2024',
    imageHint: 'stock chart',
    content: 'This is the full content for the AI stock prediction article...'
  },
  {
    title: 'Crypto Trends Q3 2024: Beyond Bitcoin and Ethereum',
    excerpt: 'Explore emerging cryptocurrencies and DeFi projects that are set to make waves in the coming quarter.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Crypto Trends',
    author: 'Jane Doe, Crypto Analyst',
    date: 'July 25, 2024',
    slug: 'crypto-trends-q3-2024',
    imageHint: 'cryptocurrency coins',
    content: 'This is the full content for the crypto trends article...'
  },
  {
    title: 'Expert Interview: Navigating Volatility with Dr. Smith',
    excerpt: 'We sit down with renowned economist Dr. Emily Smith to discuss strategies for thriving in uncertain market conditions.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Expert Interviews',
    author: 'PriductAI Insights',
    date: 'July 22, 2024',
    slug: 'expert-interview-dr-smith',
    imageHint: 'interview discussion',
    content: 'This is the full content for the expert interview...'
  },
   {
    title: 'Understanding Risk in Your Investment Portfolio',
    excerpt: 'Learn to identify, measure, and mitigate risks in your investment strategy for long-term success.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Risk Strategies',
    author: 'PriductAI Team',
    date: 'July 20, 2024',
    slug: 'understanding-risk-in-portfolio',
    imageHint: 'risk management chess',
    content: 'Full content on risk strategies...'
  },
];

const categories = ['All', 'Stock Predictions', 'Crypto Trends', 'Expert Interviews', 'Risk Strategies'];

export function BlogListPage() {
  const [activeCategory, setActiveCategory] = React.useState('All');

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">Market Insights &amp; News</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your daily source for AI-driven analysis, market trends, and financial education.
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
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
