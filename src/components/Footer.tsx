'use client';

import Link from 'next/link';
import { Linkedin, Twitter, Facebook, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border/40 bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="PredictAI Home">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">PredictAI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Predict tomorrow's markets today with AI-powered precision.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">About</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Community</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li><Link href="#blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Join Network</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contribute</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Disclaimer</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">GDPR</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">AML</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-muted-foreground">&copy; {year} PredictAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
