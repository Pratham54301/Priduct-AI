'use client';

import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { faqData } from './faqData';

const INITIAL_VISIBLE_FAQS = 10;

export function FaqSection() {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };

  const visibleFaqs = isExpanded ? faqData : faqData.slice(0, INITIAL_VISIBLE_FAQS);

  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find quick answers to common questions about PriductAI.
          </p>
        </div>

        {faqData.length > 0 ? (
          <>
            <Accordion 
              type="single" 
              collapsible 
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
            >
              {visibleFaqs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id} 
                  className="bg-card rounded-lg border shadow-sm break-inside-avoid"
                >
                  <AccordionTrigger className="text-left hover:no-underline text-base font-semibold px-6 py-4 text-start">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base px-6 pb-4 pt-0">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {faqData.length > INITIAL_VISIBLE_FAQS && (
              <div className="mt-12 text-center">
                <Button onClick={handleToggle} size="lg">
                  {isExpanded ? 'Show Less' : 'Show More'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground text-lg">
            No FAQs are available at this time.
          </p>
        )}
      </div>
    </section>
  );
}
