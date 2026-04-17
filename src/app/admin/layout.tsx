'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Sidebar, MobileSidebar } from '@/components/admin/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/context/AuthContext';
import { UserMenu } from '@/components/admin/UserMenu';
import { motion } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This layout is specific to the admin panel and includes route protection.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const isLoginRoute = pathname === '/admin/login';
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;
    if (isLoginRoute) {
      if (user && String(user.role || '').toLowerCase() === 'admin') {
        router.push('/admin/dashboard');
      } else if (user && String(user.role || '').toLowerCase() !== 'admin') {
        router.push('/');
      }
      return;
    }

    if (!user) {
      router.push('/admin/login');
      return;
    }
    if (String(user.role || '').toLowerCase() !== 'admin') {
      router.push('/');
    }
  }, [loading, user, router, isLoginRoute]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  // Render nothing or a loading spinner until verification is complete
  // to prevent flashing the admin content to unauthorized users.
  if (loading || !user || String(user.role || '').toLowerCase() !== 'admin') {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <p className="text-muted-foreground">Verifying access...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-black text-foreground">
        <Sidebar collapsed={collapsed} />
        <div className="flex flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-primary/20 bg-black/20 px-4 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <MobileSidebar />
              <Button
                variant="outline"
                size="icon"
                className="hidden md:inline-flex border-primary/30 bg-black/30"
                onClick={() => setCollapsed((prev) => !prev)}
              >
                {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                <span className="sr-only">Toggle sidebar</span>
              </Button>
              <h2 className="text-sm font-medium text-cyan-100">Admin Control Center</h2>
            </div>
            <UserMenu />
          </header>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            {children}
          </motion.div>
          <Toaster />
        </div>
    </div>
  );
}
