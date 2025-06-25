import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle } from 'lucide-react';

interface Post {
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
  slug: string;
  imageHint?: string;
  content: string;
}

interface BlogPostPageProps {
  post: Post;
}

export function BlogPostPage({ post }: BlogPostPageProps) {
  return (
    <div className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <article className="prose prose-lg dark:prose-invert mx-auto">
          <header className="mb-8">
            <Badge variant="secondary" className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center text-sm text-muted-foreground space-x-4">
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                <span>{post.date}</span>
              </div>
            </div>
          </header>

          <div className="relative w-full h-96 my-8 rounded-lg overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              data-ai-hint={post.imageHint}
            />
          </div>

          <p className="lead">{post.excerpt}</p>
          
          <div className="mt-8 space-y-6 text-foreground/90">
             {/* This is where the full post content would be rendered. 
                 For now, we just display the placeholder content.
                 In a real app, this would likely come from a CMS and be rendered from Markdown or HTML. */}
            <p>{post.content}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
            <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.</p>
          </div>
        </article>
      </div>
    </div>
  );
}
