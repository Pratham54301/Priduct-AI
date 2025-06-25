import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningModuleCard } from "./LearningModuleCard";

const learningModules = {
  beginner: [
    { title: 'Introduction to Stock Market', description: 'Understand the basics of how the stock market works.', image: 'https://placehold.co/600x400.png', imageHint: 'stock market introduction', slug: 'intro-to-stocks' },
    { title: 'What are Mutual Funds?', description: 'Learn about mutual funds and how they can diversify your portfolio.', image: 'https://placehold.co/600x400.png', imageHint: 'mutual funds chart', slug: 'what-are-mutual-funds' },
    { title: 'Basics of Cryptocurrency', description: 'A beginner\'s guide to understanding Bitcoin, Ethereum, and more.', image: 'https://placehold.co/600x400.png', imageHint: 'cryptocurrency coins', slug: 'crypto-basics' },
  ],
  intermediate: [
    { title: 'Technical Analysis 101', description: 'Learn to read charts and use indicators to make trading decisions.', image: 'https://placehold.co/600x400.png', imageHint: 'technical analysis chart', slug: 'technical-analysis-101' },
    { title: 'Fundamental Analysis of Stocks', description: 'Dive deep into company financials to find undervalued stocks.', image: 'https://placehold.co/600x400.png', imageHint: 'financial report analysis', slug: 'fundamental-analysis' },
    { title: 'Options Trading Strategies', description: 'Explore basic options strategies like covered calls and protective puts.', image: 'https://placehold.co/600x400.png', imageHint: 'options trading graph', slug: 'options-strategies' },
  ],
  advanced: [
    { title: 'Advanced Derivatives', description: 'Understand futures, options, and swaps for complex trading strategies.', image: 'https://placehold.co/600x400.png', imageHint: 'derivatives graph complex', slug: 'advanced-derivatives' },
    { title: 'Algorithmic Trading with AI', description: 'Learn how to use AI and algorithms to automate your trading.', image: 'https://placehold.co/600x400.png', imageHint: 'algorithmic trading code', slug: 'algo-trading' },
    { title: 'Portfolio Management', description: 'Master the art and science of managing a diversified investment portfolio.', image: 'https://placehold.co/600x400.png', imageHint: 'portfolio management dashboard', slug: 'portfolio-management' },
  ],
};

export function LearnPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">Knowledge is Power</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Empower your financial journey with our comprehensive learning resources.
        </p>
      </div>

      <Tabs defaultValue="beginner" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="beginner">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {learningModules.beginner.map(module => <LearningModuleCard key={module.slug} {...module} />)}
          </div>
        </TabsContent>
        <TabsContent value="intermediate">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {learningModules.intermediate.map(module => <LearningModuleCard key={module.slug} {...module} />)}
          </div>
        </TabsContent>
        <TabsContent value="advanced">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {learningModules.advanced.map(module => <LearningModuleCard key={module.slug} {...module} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
