import { TestimonialCard } from './TestimonialCard';
import { testimonialsData } from './testimonialsData';

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Success Stories from Smart Investors</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real people. Real results. Real growth.
          </p>
        </div>
      </div>
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]">
        <div className="flex w-max animate-marquee-slow hover:[animation-play-state:paused]">
          {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
            <div key={index} className="w-[360px] flex-shrink-0 px-4">
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
