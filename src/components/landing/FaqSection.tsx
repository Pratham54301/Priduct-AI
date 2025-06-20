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
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking the "Sign Up" button on our homepage and filling out the registration form. It only takes a few minutes!',
    category: 'Accounts',
  },
  {
    id: 'faq2',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers for our subscription plans.',
    category: 'Payments',
  },
  {
    id: 'faq3',
    question: 'How accurate are the AI predictions?',
    answer: 'Our AI predictions are based on advanced algorithms and historical data, designed to provide high-probability insights. However, all investments carry risk, and past performance is not indicative of future results.',
    category: 'Predictions',
  },
  {
    id: 'faq4',
    question: 'Is my personal data secure?',
    answer: 'Yes, we take data security very seriously. We use industry-standard encryption and security protocols to protect your personal information. Please see our Privacy Policy for more details.',
    category: 'Security',
  },
  {
    id: 'faq5',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.',
    category: 'Accounts',
  },
  {
    id: 'faq6',
    question: 'Do you offer a trial period for premium features?',
    answer: 'Yes, new users can often avail a free trial period for our premium features. Check our "Subscribe" section or current promotions for details.',
    category: 'Payments',
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
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find answers to common questions about PriductAI Vision.
          </p>
        </div>

        {Object.keys(groupedFaqs).length > 0 ? (
          Object.entries(groupedFaqs).map(([category, faqs]) => (
            <div key={category} className="mb-8">
              <h3 className="text-2xl font-semibold text-primary mb-4">{category}</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left hover:no-underline text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-lg">
            No FAQs found matching your search criteria.
          </p>
        )}
      </div>
    </section>
  );
}
