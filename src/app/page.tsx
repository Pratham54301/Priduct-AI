'use client';

import * as React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AiPredictionMachineSection } from '@/components/landing/AiPredictionMachineSection'; // New Import
import { HeroSection } from '@/components/landing/HeroSection';
import { MarketOverviewSection } from '@/components/landing/MarketOverviewSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { AboutUsSection } from '@/components/landing/AboutUsSection';
import { CoreServicesSection } from '@/components/landing/CoreServicesSection';
import { ConsultExpertsSection } from '@/components/landing/ConsultExpertsSection';
import { CustomerSupportSection } from '@/components/landing/CustomerSupportSection';
import { LearningHubSection } from '@/components/landing/LearningHubSection';
import { AdvertisingBannerSection } from '@/components/landing/AdvertisingBannerSection';
import { BlogInsightsSection } from '@/components/landing/BlogInsightsSection';
import { SubscribeSection } from '@/components/landing/SubscribeSection';
import { FaqSection } from '@/components/landing/FaqSection';

export default function Home() {
  const [faqSearchTerm, setFaqSearchTerm] = React.useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AiPredictionMachineSection /> {/* New Section Added */}
        <HeroSection />
        <MarketOverviewSection />
        <TestimonialsSection />
        <AboutUsSection />
        <CoreServicesSection />
        <ConsultExpertsSection />
        <CustomerSupportSection setFaqSearchTerm={setFaqSearchTerm} />
        <LearningHubSection />
        <AdvertisingBannerSection />
        <BlogInsightsSection />
        <SubscribeSection />
        <FaqSection searchTerm={faqSearchTerm} />
      </main>
      <Footer />
    </div>
  );
}
