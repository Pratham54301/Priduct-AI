
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoginPage } from '@/components/auth/LoginPage';

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <LoginPage />
      </main>
      <Footer />
    </div>
  );
}
