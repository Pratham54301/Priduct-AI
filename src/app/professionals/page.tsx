import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FindProfessionalPage } from '@/components/professionals/FindProfessionalPage';

export default function Professionals() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <FindProfessionalPage />
      </main>
      <Footer />
    </div>
  );
}
