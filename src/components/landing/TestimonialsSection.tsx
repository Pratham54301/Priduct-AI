import { TestimonialCard } from './TestimonialCard';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    photoUrl: 'https://placehold.co/112x112.png',
    feedback: 'PriductAI\'s predictions are incredibly accurate. It helped me make informed decisions and significantly boosted my portfolio.',
    returns: '+25% in 6 months',
    imageHint: 'woman investor'
  },
  {
    name: 'Rajesh Kumar',
    photoUrl: 'https://placehold.co/112x112.png',
    feedback: 'The learning hub is fantastic! I went from a novice to a confident trader with their courses and webinars.',
    imageHint: 'man professional'
  },
  {
    name: 'Anita Desai',
    photoUrl: 'https://placehold.co/112x112.png',
    feedback: 'I love the real-time market snapshots and the detailed intelligence reports. It\'s my go-to platform for all things finance.',
    returns: 'Consistent 15% YoY',
    imageHint: 'person happy'
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Success Stories from Smart Investors</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear what our users have to say about their journey with PriductAI Vision.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            Share My Story <Send className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
