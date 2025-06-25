import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, CheckCircle } from 'lucide-react';

interface ProfessionalCardProps {
  name: string;
  profession: string;
  location: string;
  rating: number;
  photoUrl: string;
  imageHint: string;
}

export function ProfessionalCard({ name, profession, location, rating, photoUrl, imageHint }: ProfessionalCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
      <CardHeader className="items-center text-center p-6">
        <Image
          src={photoUrl}
          alt={name}
          width={96}
          height={96}
          className="rounded-full mb-4 border-2 border-primary object-cover"
          data-ai-hint={imageHint}
        />
        <CardTitle className="text-xl font-semibold text-foreground">{name}</CardTitle>
        <CardDescription className="text-primary">{profession}</CardDescription>
        <div className="flex items-center text-sm text-muted-foreground mt-1 gap-1">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center text-center p-6 pt-0">
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
          ))}
          <span className="ml-2 text-xs text-muted-foreground">({rating.toFixed(1)})</span>
        </div>
        <Button className="w-full mt-auto">View Profile</Button>
        <Button variant="outline" className="w-full mt-2">Book Consultation</Button>
      </CardContent>
    </Card>
  );
}
