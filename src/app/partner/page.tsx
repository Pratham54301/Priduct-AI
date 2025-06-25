import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BecomePartnerPage } from '@/components/partner/BecomePartnerPage';

export default function Partner() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <BecomePartnerPage />
      </main>
      <Footer />
    </div>
  );
}
