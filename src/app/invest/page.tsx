import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InvestPage } from '@/components/invest/InvestPage';

export default function Invest() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <InvestPage />
      </main>
      <Footer />
    </div>
  );
}
