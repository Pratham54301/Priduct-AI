import { AdminLoginPage } from '@/components/auth/AdminLoginPage';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function AdminLoginRoute() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <AdminLoginPage />
      </main>
      <Footer />
    </div>
  );
}
