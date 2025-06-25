
'use client';

import * as React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AiPredictionMachineSection } from '@/components/landing/AiPredictionMachineSection';
import { MarketOverviewSection } from '@/components/landing/MarketOverviewSection';
import { CoreServicesSection } from '@/components/landing/CoreServicesSection';
import { LearningHubSection } from '@/components/landing/LearningHubSection';
import { ConsultExpertsSection } from '@/components/landing/ConsultExpertsSection';
import { BecomePartnerSection } from '@/components/landing/BecomePartnerSection';
import { BlogInsightsSection } from '@/components/landing/BlogInsightsSection';
import { AboutUsSection } from '@/components/landing/AboutUsSection';
import { CustomerSupportSection } from '@/components/landing/CustomerSupportSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { AdvertisingBannerSection } from '@/components/landing/AdvertisingBannerSection';
import { SubscribeSection } from '@/components/landing/SubscribeSection';

export default function Home() {
  const [faqSearchTerm, setFaqSearchTerm] = React.useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AiPredictionMachineSection />
        <MarketOverviewSection />
        <TestimonialsSection />
        <CoreServicesSection />
        <LearningHubSection />
        <ConsultExpertsSection />
        <BecomePartnerSection />
        <BlogInsightsSection />
        <AboutUsSection />
        <CustomerSupportSection setFaqSearchTerm={setFaqSearchTerm} />
        <FaqSection searchTerm={faqSearchTerm} />
        <AdvertisingBannerSection />
        <SubscribeSection />
      </main>
      <Footer />
    </div>
  );
}
