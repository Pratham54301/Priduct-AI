import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TestimonialCardProps {
  name: string;
  location: string;
  label: string;
  photoUrl: string;
  feedback: string;
  rating: number;
  imageHint?: string;
}

export function TestimonialCard({ name, location, label, photoUrl, feedback, rating, imageHint = "person" }: TestimonialCardProps) {
  return (
    <Card className="h-full flex flex-col shadow-lg overflow-hidden bg-card border border-border/60">
      <CardContent className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-4">
            <Image
              src={photoUrl}
              alt={name}
              width={56}
              height={56}
              className="rounded-full mr-4 object-cover border-2 border-primary"
              data-ai-hint={imageHint}
            />
            <div>
              <p className="font-semibold text-foreground">{name}</p>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          </div>
          <blockquote className="text-muted-foreground mb-4 text-sm">
            <p>&ldquo;{feedback}&rdquo;</p>
          </blockquote>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
          <Badge variant="secondary">{label}</Badge>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
            ))}
            <span className="ml-1.5 text-xs font-bold text-foreground">{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
