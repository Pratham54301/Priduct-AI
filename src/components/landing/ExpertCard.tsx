import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CalendarPlus, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExpertCardProps {
  name: string;
  title: string;
  photoUrl: string;
  specialties: string[];
  rating: number;
  imageHint?: string;
}

export function ExpertCard({ name, title, photoUrl, specialties, rating, imageHint = "person professional" }: ExpertCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
      <CardHeader className="items-center text-center">
        <Image
          src={photoUrl}
          alt={name}
          width={96}
          height={96}
          className="rounded-full mb-4 border-2 border-primary object-cover"
          data-ai-hint={imageHint}
        />
        <CardTitle className="text-xl font-semibold text-foreground">{name}</CardTitle>
        <CardDescription className="text-primary">{title}</CardDescription>
        <div className="flex mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
          ))}
           <span className="ml-1 text-xs text-muted-foreground">({rating.toFixed(1)})</span>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary">{specialty}</Badge>
          ))}
        </div>
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Book a Consultation <CalendarPlus className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
