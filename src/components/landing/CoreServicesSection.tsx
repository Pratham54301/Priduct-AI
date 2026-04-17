import { ServiceCard } from './ServiceCard';
import { BarChartBig, DatabaseZap, GraduationCap, ShieldCheck, Users, Gem } from 'lucide-react';

const services = [
  {
    icon: BarChartBig,
    title: 'AI Prediction',
    description: 'Leverage advanced algorithms for Indian stock market forecasts (NSE & BSE).',
  },
  {
    icon: DatabaseZap,
    title: 'Market Intelligence',
    description: 'Access real-time data, technical indicators, and Indian stock market insights.',
  },
  {
    icon: GraduationCap,
    title: 'Learning &amp; Training',
    description: 'Enhance your knowledge with webinars, courses, and tutorials.',
  },
  {
    icon: ShieldCheck,
    title: 'Investment Insurance',
    description: 'Secure your investments with our partnered insurance options.',
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Get guidance from verified professionals and our support team.',
  },
  {
    icon: Gem,
    title: 'Premium Membership',
    description: 'Unlock advanced tools, exclusive content, and priority support.',
  },
];

export function CoreServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Indian Stock Market Intelligence Suite</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to make smarter investment decisions in the Indian stock market, all in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
