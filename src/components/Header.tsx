import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Brain } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Live Markets', href: '/#features' },
  { label: 'Invest', href: '/invest' },
  { label: 'Learn', href: '/learn' },
  { label: 'Find Professional', href: '/professionals' },
  { label: 'Become Partner', href: '/partner' },
  { label: 'News', href: '/blog' },
  { label: 'About Us', href: '/#about' },
  { label: 'Support', href: '/#support' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="PredictAI Home">
          <Brain className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground">PredictAI</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="hidden md:inline-flex">
            <Link href="/login">Login</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/login">Login</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
