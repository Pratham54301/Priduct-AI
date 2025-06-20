import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight, CalendarDays, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
  slug: string;
  imageHint?: string;
}

export function BlogCard({ title, excerpt, imageUrl, category, author, date, slug, imageHint = "article" }: BlogCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300 h-full">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={imageHint}
        />
      </div>
      <CardHeader>
        <Badge variant="secondary" className="w-fit mb-2">{category}</Badge>
        <CardTitle className="text-xl font-semibold text-foreground leading-tight hover:text-primary transition-colors">
          <a href={`/blog/${slug}`}>{title}</a>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-muted-foreground line-clamp-3">{excerpt}</CardDescription>
        <div className="mt-4 flex items-center text-xs text-muted-foreground space-x-4">
          <div className="flex items-center">
            <UserCircle className="h-4 w-4 mr-1" />
            <span>{author}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>{date}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="p-0 text-primary hover:text-primary/80" asChild>
          <a href={`/blog/${slug}`}>
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
