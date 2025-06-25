import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { InterestForm } from './InterestForm';
import { Card } from '@/components/ui/card';

interface Step {
  title: string;
  description: string;
}

interface InvestmentCategoryProps {
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  steps: Step[];
  formType: string;
}

export function InvestmentCategory({ title, description, imageUrl, imageHint, steps, formType }: InvestmentCategoryProps) {
  return (
    <Card className="mt-6 p-4 md:p-8 border-border/40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-xl mb-8">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              data-ai-hint={imageHint}
            />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4">{title}</h2>
          <p className="text-muted-foreground mb-8">{description}</p>
        </div>
        <div>
          <InterestForm formType={formType} />
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-3xl font-bold text-center mb-8">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 mx-auto font-bold text-2xl">
                {index + 1}
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">{step.title}</h4>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
