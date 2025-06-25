import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BlogPostPage } from '@/components/blog/BlogPostPage';
import { blogPosts } from '@/components/blog/BlogListPage';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <BlogPostPage post={post} />
      </main>
      <Footer />
    </div>
  );
}
