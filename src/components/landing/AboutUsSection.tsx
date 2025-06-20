import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Zap, TrendingUp } from 'lucide-react';

export function AboutUsSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">The Vision Behind PriductAI Vision</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Empowering investors with AI-driven insights for a smarter financial future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-primary mb-4">Our Mission</h3>
            <p className="text-muted-foreground mb-6">
              To democratize access to advanced financial forecasting tools, enabling individuals and institutions alike to navigate complex markets with confidence and precision. We believe in leveraging the power of artificial intelligence to provide actionable insights that drive success.
            </p>
            <h3 className="text-2xl font-semibold text-primary mb-4">Our Values</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <Zap className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                <span><strong>Innovation:</strong> Continuously pushing the boundaries of AI in finance.</span>
              </li>
              <li className="flex items-start">
                <Target className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                <span><strong>Integrity:</strong> Upholding the highest standards of transparency and ethics.</span>
              </li>
              <li className="flex items-start">
                <Users className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                <span><strong>User-Centricity:</strong> Placing our users at the heart of everything we do.</span>
              </li>
            </ul>
          </div>
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://placehold.co/600x400.png"
              alt="PriductAI Vision Team or Office"
              layout="fill"
              objectFit="cover"
              data-ai-hint="team meeting"
              className="transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center text-primary mb-8">Our Journey &amp; Trust Timeline</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-5 left-1/2 w-0.5 h-[calc(100%-2.5rem)] bg-border -translate-x-1/2"></div>
            
            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              {[
                { year: "2021", title: "Inception", desc: "PriductAI founded with a vision to revolutionize financial forecasting.", icon: <Zap/> },
                { year: "2022", title: "Alpha Launch", desc: "First AI models deployed, initial user testing and feedback.", icon: <TrendingUp/> },
                { year: "2023", title: "Public Beta", desc: "Platform opened to a wider audience, core features refined.", icon: <Users/> },
                { year: "2024", title: "Growth &amp; Expansion", desc: "Expanding service offerings and global reach.", icon: <Target/> },
              ].map((item, index) => (
                <div key={item.year} className={`relative flex items-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse text-right'}`}>
                  <div className="md:hidden absolute top-0 h-full w-0.5 bg-border left-5"></div> {/* Mobile timeline line */}
                  <div className="relative z-10">
                    <div className={`w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md ${index % 2 === 0 ? 'md:ml-[-2.3rem]' : 'md:mr-[-2.3rem]'}`}>
                      {item.icon}
                    </div>
                  </div>
                  <Card className={`ml-8 md:ml-0 md:w-full shadow-lg ${index % 2 === 0 ? 'md:mr-4' : 'md:ml-4'}`}>
                    <CardContent className="p-6">
                      <p className="text-sm font-semibold text-accent">{item.year}</p>
                      <h4 className="text-lg font-semibold text-foreground mt-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
