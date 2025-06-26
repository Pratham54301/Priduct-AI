
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, Zap, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const benefits: BenefitCardProps[] = [
  {
    icon: Users,
    title: 'Expand Your Reach',
    description: 'Connect with a diverse user base actively seeking financial expertise and tools.',
  },
  {
    icon: DollarSign,
    title: 'Earn Recurring Revenue',
    description: 'Benefit from a competitive commission structure and grow your income streams.',
  },
  {
    icon: Zap,
    title: 'Exclusive AI Insights',
    description: 'Gain access to our advanced AI models and proprietary data to enhance your services.',
  },
];

const BenefitCard = ({ icon: Icon, title, description }: BenefitCardProps) => (
  <Card className="text-center shadow-lg hover:shadow-primary/20 transition-shadow duration-300 bg-card">
    <CardHeader>
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <CardTitle className="text-xl font-semibold text-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export function BecomePartnerSection() {
  return (
    <section id="partner" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Collaborate & Grow With Us</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join our growing network of professionals and bring AI-powered insights to your clients. Partner with PriductAI to unlock new opportunities and deliver unparalleled value.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Apply as a Partner <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
