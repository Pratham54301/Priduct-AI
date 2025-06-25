import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BlogListPage } from '@/components/blog/BlogListPage';

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <BlogListPage />
      </main>
      <Footer />
    </div>
  );
}
