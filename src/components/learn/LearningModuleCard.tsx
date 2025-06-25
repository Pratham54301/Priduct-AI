import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface LearningModuleCardProps {
  title: string;
  description: string;
  image: string;
  imageHint: string;
  slug: string;
}

export function LearningModuleCard({ title, description, image, imageHint, slug }: LearningModuleCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded-t-lg"
            data-ai-hint={imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="mb-2 text-xl">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <a href={`/learn/${slug}`}>
            Start Learning <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
