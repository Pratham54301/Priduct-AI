import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LearnPage } from '@/components/learn/LearnPage';

export default function Learn() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <LearnPage />
      </main>
      <Footer />
    </div>
  );
}
