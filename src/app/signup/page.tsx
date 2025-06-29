import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SignUpPage } from '@/components/auth/SignUpPage';

export default function SignUp() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <SignUpPage />
      </main>
      <Footer />
    </div>
  );
}
