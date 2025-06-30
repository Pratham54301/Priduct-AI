'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { Toaster } from '@/components/ui/toaster';

// This layout is specific to the admin panel and includes route protection.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = React.useState(false);

  React.useEffect(() => {
    // THIS IS NOT A SECURE WAY TO PROTECT A ROUTE in a production app.
    // In a real application, this logic should be handled by a server-side middleware
    // that validates a secure, HTTP-only cookie or a JWT token.
    if (typeof sessionStorage !== 'undefined') {
        const isAdmin = sessionStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            router.push('/login');
        } else {
            setIsVerified(true);
        }
    } else {
        // Fallback for environments where sessionStorage might not be immediately available.
        router.push('/login');
    }
  }, [router]);

  // Render nothing or a loading spinner until verification is complete
  // to prevent flashing the admin content to unauthorized users.
  if (!isVerified) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <p className="text-muted-foreground">Verifying access...</p>
        </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background text-foreground">
        <Sidebar />
        <div className="flex flex-col">
          {children}
          <Toaster />
        </div>
    </div>
  );
}
