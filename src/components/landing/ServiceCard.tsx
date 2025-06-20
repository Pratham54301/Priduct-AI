import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLink?: string;
}

export function ServiceCard({ icon: Icon, title, description, ctaLink = "#" }: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col shadow-lg hover:shadow-accent/20 transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent mb-4 mx-auto">
          <Icon className="w-6 h-6" />
        </div>
        <CardTitle className="text-xl font-semibold text-center text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <CardDescription className="text-center text-muted-foreground flex-grow">{description}</CardDescription>
        <div className="mt-6 text-center">
          <Button variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10" asChild>
            <a href={ctaLink}>
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
