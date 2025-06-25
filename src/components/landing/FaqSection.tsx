'use client';

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FaqItemData {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FaqItemData[] = [
  {
    id: 'faq1',
    question: 'What is PredictAI?',
    answer: 'PredictAI is an AI-powered platform that provides financial market forecasts, real-time data, and educational resources to help investors make smarter decisions.',
    category: 'General',
  },
  {
    id: 'faq2',
    question: 'How accurate are the predictions?',
    answer: 'Our AI predictions are based on advanced algorithms and historical data, designed to provide high-probability insights. However, all investments carry risk, and past performance is not indicative of future results.',
    category: 'Predictions',
  },
  {
    id: 'faq3',
    question: 'Can I use PredictAI for crypto?',
    answer: 'Yes, PredictAI covers a wide range of markets, including stocks, cryptocurrencies, commodities, and foreign exchange (forex).',
    category: 'Markets',
  },
    {
    id: 'faq4',
    question: 'How do I become a partner?',
    answer: 'You can apply to become a partner through the "Become a Partner" section on our website. We welcome financial professionals, educators, and influencers to join our network.',
    category: 'Partnerships',
  },
  {
    id: 'faq5',
    question: 'What markets do you cover?',
    answer: 'We cover major global markets, including stock indices (like Nifty 50, Nasdaq), individual stocks, major cryptocurrencies (like Bitcoin), commodities (like Gold and Oil), and currency pairs (like USD/INR).',
    category: 'Markets',
  },
  {
    id: 'faq6',
    question: 'Is there a free trial?',
    answer: 'Yes, we offer a limited number of free predictions for new users. For full access to all features and unlimited predictions, you can subscribe to one of our premium plans.',
    category: 'General',
  },
];

interface FaqSectionProps {
  searchTerm: string;
}

export function FaqSection({ searchTerm }: FaqSectionProps) {
  const [filteredFaqs, setFilteredFaqs] = React.useState<FaqItemData[]>(faqData);

  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFaqs(faqData);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = faqData.filter(
        (faq) =>
          faq.question.toLowerCase().includes(lowercasedFilter) ||
          faq.answer.toLowerCase().includes(lowercasedFilter) ||
          faq.category.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredFaqs(filtered);
    }
  }, [searchTerm]);

  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FaqItemData[]>);


  return (
    <section id="faq" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find quick answers to common questions about PriductAI.
          </p>
        </div>

        {Object.keys(groupedFaqs).length > 0 ? (
          Object.entries(groupedFaqs).map(([category, faqs]) => (
            <div key={category} className="mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-4">{category}</h3>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id} 
                    className="bg-background rounded-lg border shadow-sm"
                  >
                    <AccordionTrigger className="text-left hover:no-underline text-base font-semibold px-6 py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base px-6 pb-4 pt-0">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-lg">
            No FAQs found matching your search term.
          </p>
        )}
      </div>
    </section>
  );
}
