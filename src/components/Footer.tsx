'use client';

import Link from 'next/link';
import { 
  Brain, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Send, // Using Send for Telegram
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
    { name: 'Telegram', icon: Send, href: '#' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/#about' },
    { name: 'Contact Us', href: '/#support' },
    { name: 'Work With Us', href: '#' },
    { name: 'Feedback', href: '#' },
    { name: 'Join Our Network', href: '/partner' },
    { name: 'Advertise With Us', href: '#' },
    { name: 'Press & Media', href: '#' },
    { name: 'Careers', href: '#' },
  ];

  const supportLinks = [
    { name: 'FAQ', href: '/#faq' },
    { name: 'Disclaimer', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Refund Policy', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Responsible Disclosure', href: '#' },
  ];

  const toolsLinks = [
    { name: 'Get Prediction', href: '/' },
    { name: 'AI Dashboard', href: '#' },
    { name: 'Download Mobile App', href: '#' },
    { name: 'Partner Portal', href: '/partner' },
    { name: 'Developer API Access', href: '#' },
    { name: 'Live Market Updates', href: '/#features' },
    { name: 'Become a Partner', href: '/partner' },
  ];

  return (
    <footer className="border-t border-border/40 bg-card py-16 text-sm text-muted-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Contact & Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="PredictAI Home">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">PredictAI</span>
            </Link>
            <div className="space-y-3">
               <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                <span>123 Innovation Drive, Tech Park, Bengaluru, 560103, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="mailto:support@predictai.com" className="hover:text-primary hover:underline">support@predictai.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="tel:+919876543210" className="hover:text-primary hover:underline">+91 9876543210</a>
              </div>
               <p className="pl-7 text-xs">Support: Mon–Fri, 9am–6pm IST</p>
            </div>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.href} aria-label={social.name} className="text-muted-foreground transition-colors hover:text-primary">
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-foreground">Company</h3>
            <ul role="list" className="mt-4 space-y-3">
              {companyLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary hover:underline">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-foreground">Support & Legal</h3>
            <ul role="list" className="mt-4 space-y-3">
              {supportLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary hover:underline">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-foreground">Tools & Services</h3>
            <ul role="list" className="mt-4 space-y-3">
              {toolsLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary hover:underline">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-16 border-t border-border/40 pt-8 text-center">
          <p>&copy; {year} PredictAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}