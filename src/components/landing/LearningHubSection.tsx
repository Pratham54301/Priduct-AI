
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, BookOpen, GraduationCap, Users } from 'lucide-react';
import Image from 'next/image';

const learningCategories = [
  {
    icon: PlayCircle,
    title: 'Live Webinars',
    description: 'Join interactive sessions with market experts and get your questions answered live.',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'webinar presentation'
  },
  {
    icon: BookOpen,
    title: 'Recorded Courses',
    description: 'Learn at your own pace with our comprehensive library of on-demand video courses.',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'online course'
  },
  {
    icon: GraduationCap,
    title: 'Market Tutorials',
    description: 'Master specific trading concepts and platform features with short, focused tutorials.',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'financial tutorial'
  },
  {
    icon: Users, // Using Users as a proxy for Certification Programs for now
    title: 'Certification Programs',
    description: 'Validate your skills and enhance your profile with our recognized certifications.',
    imageSrc: 'https://placehold.co/600x400.png',
    imageHint: 'certificate award'
  },
];

export function LearningHubSection() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Grow With Knowledge</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Expand your financial literacy and trading skills with our expert-led resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {learningCategories.map((category) => (
            <Card key={category.title} className="overflow-hidden shadow-lg hover:shadow-accent/20 transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={category.imageSrc} 
                  alt={category.title} 
                  fill 
                  className="object-cover"
                  data-ai-hint={category.imageHint} 
                />
              </div>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <category.icon className="h-6 w-6 text-accent mr-3" />
                  <CardTitle className="text-xl font-semibold text-foreground">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <Button variant="link" className="text-accent p-0 hover:text-accent/80">
                  Explore {category.title} &amp;rarr;
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Join the Next Class <Users className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
