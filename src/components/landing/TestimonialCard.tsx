import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  photoUrl: string;
  feedback: string;
  returns?: string;
  rating?: number;
  imageHint?: string;
}

export function TestimonialCard({ name, photoUrl, feedback, returns, rating = 5, imageHint = "person" }: TestimonialCardProps) {
  return (
    <Card className="h-full flex flex-col shadow-lg overflow-hidden">
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex items-center mb-4">
          <Image
            src={photoUrl}
            alt={name}
            width={56}
            height={56}
            className="rounded-full mr-4 object-cover"
            data-ai-hint={imageHint}
          />
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            {returns && <p className="text-sm text-primary">{returns}</p>}
          </div>
        </div>
        <blockquote className="text-muted-foreground flex-grow">
          <p>&ldquo;{feedback}&rdquo;</p>
        </blockquote>
        {rating && (
          <div className="mt-4 flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
