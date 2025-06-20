import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Mail, HelpCircle, Search } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface CustomerSupportSectionProps {
  setFaqSearchTerm: Dispatch<SetStateAction<string>>;
}

export function CustomerSupportSection({ setFaqSearchTerm }: CustomerSupportSectionProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFaqSearchTerm(event.target.value);
  };

  return (
    <section id="support" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">We're Always Here to Help</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get the support you need, when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center shadow-lg">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold">Live Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Chat with our support team in real-time for immediate assistance.</p>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Start Chat</Button>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg">
            <CardHeader>
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold">24/7 Email Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Send us an email anytime and we'll get back to you promptly.</p>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Email Us</Button>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg">
            <CardHeader>
              <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl font-semibold">Help Center</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Find answers to common questions and learn more about our platform.</p>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Visit Help Center</Button>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-center text-foreground mb-4">Search FAQs</h3>
          <div className="relative">
            <Input
              type="search"
              placeholder="Ask a question..."
              className="pl-10 text-base"
              onChange={handleSearchChange}
              aria-label="Search FAQs"
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}
